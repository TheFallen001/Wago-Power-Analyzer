/**
 * Node.js Intermediary Server for WDX WebSocket
 * Connects to WDX server and forwards data to React Native clients
 */
const WDXWSClient = require("@wago/wdx-ws-client-js");
const WebSocket = require("ws");
const { DataService } = require("./services/DataService.js");
const { ChartService } = require("./services/ChartService.js");
const { AlarmService } = require("./services/AlarmService.js");
const WDXWSClientConfiguration = require("@wago/wdx-ws-client-js");
const Model = require("./utils");
const Services = require("./NewServices");

// Set up WebSocket server for React Native clients
const wss = new WebSocket.Server({ port: 8080 });
console.log("WebSocket server started on ws://localhost:8080");

// Store connected clients
const clients = new Set();

// Store the latest schema for new clients
let latestSchemaDevices = [];

// Move client to a higher scope so it is accessible in the WebSocket connection handler
let client;

// Throttle volt/curr data broadcasts per device/key
const lastDataBroadcastTime = {};
const DATA_BROADCAST_INTERVAL = 5000; // ms

wss.on("connection", (ws) => {
  console.log("New React Native client connected at", new Date().toISOString());
  clients.add(ws);

  // Send latest schema to new client
  if (latestSchemaDevices.length > 0) {
    console.log("Sending latest schema to new client");
    const messageString = JSON.stringify({
      type: "schema",
      devices: latestSchemaDevices,
    });
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageString);
      console.log("Sent initial schema:", messageString);
    }
  }

  ws.on("close", () => {
    console.log(
      "React Native client disconnected at",
      new Date().toISOString()
    );
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error(
      "Client WebSocket error at",
      new Date().toISOString(),
      ":",
      error.message
    );
    clients.delete(ws);
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "setConfig" && message.path && message.config) {
        if (
          client &&
          client.dataService &&
          typeof client.dataService.setValue === "function"
        ) {
          // For each config key, use the correct WDX key mapping and update the value at the correct path
          Object.entries(message.config).forEach(([key, value]) => {
            let wdxKey = key;
            if (key === "addr1") wdxKey = "addr1";
            else if (key === "baud1") wdxKey = "baud1";
            else if (key === "check1") wdxKey = "check1";
            else if (key === "stopBit1") wdxKey = "stopBit1";
            else if (key === "baud2") wdxKey = "baud2";
            else if (key === "check2") wdxKey = "check2";
            else if (key === "stopBit2") wdxKey = "stopBit2";

            // For volt/curr, do NOT append key to path
            let valuePath;
            if (key === "volt" || key === "curr") {
              valuePath = message.path; // Use as-is
            } else {
              valuePath = `${message.path}.${wdxKey}`;
            }

            // Remove noisy logs for volt/curr updates
            // console.log(`[WDX setValue] Attempting to set`, {
            //   path: valuePath,
            //   key: wdxKey,
            //   value,
            // });
            client.dataService.setValue(valuePath, value).subscribe({
              next: (result) => {
                console.log("[WDX setValue SUCCESS]", {
                  path: valuePath,
                  key: wdxKey,
                  value,
                  result: JSON.stringify(result),
                });
                ws.send(
                  JSON.stringify({
                    type: "configUpdated",
                    path: valuePath,
                    config: { [wdxKey]: value },
                  })
                );
                // Broadcast to all clients so all UIs update immediately
                let shouldBroadcast = true;
                if (wdxKey === "volt" || wdxKey === "curr") {
                  // Throttle volt/curr broadcasts
                  const deviceKey = `${valuePath}`;
                  const now = Date.now();
                  if (
                    lastDataBroadcastTime[deviceKey] &&
                    now - lastDataBroadcastTime[deviceKey] < DATA_BROADCAST_INTERVAL
                  ) {
                    shouldBroadcast = false;
                  } else {
                    lastDataBroadcastTime[deviceKey] = now;
                  }
                }
                if (shouldBroadcast) {
                  broadcast({
                    type: "data",
                    path: valuePath,
                    value: { [wdxKey]: value },
                  });
                }
                // Only refresh and broadcast schema if not volt/curr
                if (wdxKey !== "volt" && wdxKey !== "curr") {
                  client.dataService.getSchema("Virtual", 1).subscribe({
                    next: (schema) => {
                      const children = schema.children || [];
                      // For each device, subscribe to its value and update config with the actual value
                      const devicePromises = children.map((child) => {
                        return new Promise((resolve) => {
                          client.dataService.register(child.path).subscribe({
                            next: (data) => {
                              const deviceName =
                                child.path.split(".").pop() || child.path;
                              resolve({
                                name: deviceName,
                                config: {
                                  addr1:
                                    data?.value?.addr1 ?? data?.value?.Addr1 ?? 0,
                                  baud1:
                                    data?.value?.baud1 ?? data?.value?.Baud1 ?? 0,
                                  check1:
                                    data?.value?.check1 ??
                                    data?.value?.["Check Digit 1"] ??
                                    0,
                                  stopBit1:
                                    data?.value?.stopBit1 ??
                                    data?.value?.["Stop Bit 1"] ??
                                    0,
                                  baud2:
                                    data?.value?.baud2 ?? data?.value?.Baud2 ?? 0,
                                  check2:
                                    data?.value?.check2 ??
                                    data?.value?.["Check Digit 2"] ??
                                    0,
                                  stopBit2:
                                    data?.value?.stopBit2 ??
                                    data?.value?.["Stop Bit 2"] ??
                                    0,
                                },
                                path: child.path,
                              });
                            },
                            error: () => {
                              const deviceName =
                                child.path.split(".").pop() || child.path;
                              resolve({
                                name: deviceName,
                                config: {
                                  addr1: 0,
                                  baud1: 0,
                                  check1: 0,
                                  stopBit1: 0,
                                  baud2: 0,
                                  check2: 0,
                                  stopBit2: 0,
                                },
                                path: child.path,
                              });
                            },
                          });
                        });
                      });
                      Promise.all(devicePromises).then((devices) => {
                        latestSchemaDevices = devices.map(({ name, config }) => ({
                          name,
                          config,
                        }));
                        broadcast({
                          type: "schema",
                          devices: latestSchemaDevices,
                        });
                      });
                    },
                    error: (err) => {
                      console.error("[WDX getSchema ERROR after setValue]", err);
                    },
                  });
                }
              },
              error: (err) => {
                console.error("[WDX setValue ERROR]", {
                  path: valuePath,
                  key: wdxKey,
                  value,
                  error: err && err.message ? err.message : err,
                });
                ws.send(
                  JSON.stringify({
                    type: "configUpdateError",
                    path: valuePath,
                    error: err && err.message ? err.message : err,
                  })
                );
              },
            });
          });
        }
      } else if (message.type === "addDevice") {
        if (
          client &&
          client.instanceService &&
          typeof client.instanceService.save === "function"
        ) {
          // Use the correct classes for schema and metadata
          const { Data } = Model;
          const { MetaData } = Data;
          const { DataSchema } = Data;
          const { MetaDataVirtualAdapter, MetaDataVirtual } = MetaData;

          const instance = Model.Instance.DataAdapter.VirtualDataAdapterInstance();
          instance.name = message.device && message.device.name ? message.device.name : "Random";
          instance.type = "Virtual";

          client.instanceService.save(instance).subscribe({
            next: (result) => {
              if (result && result.uuid) {
                client.instanceService.start(result.uuid).subscribe({
                  next: () => {
                    // Build schema with correct metadata objects
                    const children = [
                      { key: "curr", type: "number" },
                      { key: "volt", type: "number" },
                      { key: "addr1", type: "number" },
                      { key: "baud1", type: "number" },
                      { key: "baud2", type: "number" },
                      { key: "check1", type: "number" },
                      { key: "check2", type: "number" },
                      { key: "stopBit1", type: "number" },
                      { key: "stopBit2", type: "number" },
                    ];

                    // Create children schemas with MetaDataVirtual
                    const childSchemas = children.map(({ key, type }) => {
                      return new DataSchema(
                        `Virtual.${instance.name}.${key}`,
                        key,
                        key,
                        undefined,
                        new MetaDataVirtual(),
                        false, // readonly
                        true,  // subscribeable
                        true,  // editable
                        false, // extendable
                        true,  // removable
                        false  // refreshable
                      );
                    });

                    // Create parent schema with MetaDataVirtualAdapter
                    const parentSchema = new DataSchema(
                      `Virtual.${instance.name}`,
                      instance.name,
                      instance.name,
                      childSchemas,
                      new MetaDataVirtualAdapter(),
                      false, // readonly
                      true,  // subscribeable
                      true,  // editable
                      true,  // extendable
                      true,  // removable
                      false  // refreshable
                    );

                    client.dataService.setSchema(parentSchema).subscribe({
                      next: () => {
                        console.log(`Schema set for instance ${instance.name}`);
                        client.dataService.getSchema("Virtual", 1).subscribe({
                          next: (updatedSchema) => {
                            const children = updatedSchema.children || [];
                            const devicePromises = children.map((child) => {
                              return new Promise((resolve) => {
                                client.dataService
                                  .register(child.path)
                                  .subscribe({
                                    next: (data) => {
                                      const deviceName = child.path.split(".").pop() || child.path;
                                      resolve({
                                        name: deviceName,
                                        config: {
                                          addr1: data?.value?.addr1 ?? 0,
                                          baud1: data?.value?.baud1 ?? 0,
                                          check1: data?.value?.check1 ?? 0,
                                          stopBit1: data?.value?.stopBit1 ?? 0,
                                          baud2: data?.value?.baud2 ?? 0,
                                          check2: data?.value?.check2 ?? 0,
                                          stopBit2: data?.value?.stopBit2 ?? 0,
                                        },
                                        path: child.path,
                                      });
                                    },
                                    error: () => {
                                      const deviceName = child.path.split(".").pop() || child.path;
                                      resolve({
                                        name: deviceName,
                                        config: {
                                          addr1: 0,
                                          baud1: 0,
                                          check1: 0,
                                          stopBit1: 0,
                                          baud2: 0,
                                          check2: 0,
                                          stopBit2: 0,
                                        },
                                        path: child.path,
                                      });
                                    },
                                  });
                              });
                            });
                            Promise.all(devicePromises).then((devices) => {
                              latestSchemaDevices = devices.map(({ name, config }) => ({
                                name,
                                config,
                              }));
                              broadcast({
                                type: "schema",
                                devices: latestSchemaDevices,
                              });
                            });
                          },
                          error: (err) => {
                            console.error("[WDX getSchema ERROR after setSchema]", err);
                          },
                        });
                      },
                      error: (err) => {
                        console.error(`Failed to set schema for instance ${instance.name}:`, err);
                      },
                    });
                  },
                  error: (err) => {
                    console.error("Failed to start instance after save:", err);
                  },
                });
              }
            },
            complete: (result) => {
              console.log("On Complete: ", result);
            },
            error: (result) => {
              console.log("The error encountered: ", result);
              console.log("Instance used: ", instance);
            },
          });
        } else {
          console.error("InstanceService not available or save method not found");
        }
      } else if (message.type === "getLogs") {
        // TODO: wait for SLavomir's response
        if (client && client.instanceService) {
          response = client.instanceService
            .whois(message.deviceName)
            .subscribe({
              next: (response) => {
                client.instanceService.logSubscribe(response.uuid).subscribe({
                  next: (response) => {
                    console.log(
                      "Response: ",
                      JSON.stringify(response, null, 2)
                    );
                    ws.send(
                      JSON.stringify({
                        type: "updateLogs",
                        logs: JSON.stringify(response),
                      })
                    );
                  },
                  error: async (error) => {
                    console.log("Error encountered: ", error);
                  },
                  complete: async () => {
                    console.log("Got all logs");
                  },
                });
              },
              error: (error) => {
                console.error("Error: ", error);
              },
            });
        }
      }
    } catch (err) {
      console.error("Failed to process message from frontend:", err);
    }
  });
});

// Broadcast message to all connected clients
const broadcast = (message) => {
  const messageString = JSON.stringify(message);
  console.log(
    "Broadcasting message to clients at",
    new Date().toISOString(),
    ":",
    messageString
  );
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    } else {
      console.log("Client not in OPEN state, removing:", client.readyState);
      clients.delete(client);
    }
  });
};

// Initialize WDX client
const initializeWDXClient = async () => {
  client = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
    {
      url: "ws://192.168.31.214:7481/wdx/ws",
      reconnectAttempts: 5,
      reconnectDelay: 1000,
    },
    WDXWSClientConfiguration.wsConfiguration
  );

  // Attach DataService to client for backend operations, passing the client instance
  client.dataService = new DataService(client);
  client.instanceService = new Services.InstanceService(client);

  client.runtimeService =
    new WDXWSClient.WDX.WS.Client.JS.Service.RuntimeService(client);

  try {
    console.log(
      "Connecting to WDX server at ws://192.168.31.214:7481/wdx/ws at",
      new Date().toISOString()
    );
    await client.connect();
    console.log(
      "Connected successfully to WDX server at",
      new Date().toISOString()
    );

    const path = "Virtual";

    // Subscribe to schema
    client.dataService.getSchema(path, 1).subscribe({
      next: (schema) => {
        console.log(
          "Schema received for path:",
          path,
          "at",
          new Date().toISOString()
        );
        const children = schema.children || [];
        if (!Array.isArray(children) || children.length === 0) {
          console.log(
            "No children found in schema or invalid schema data at",
            new Date().toISOString()
          );
          return;
        }

        // Subscribe to all child nodes and collect their initial values
        const devicePromises = children.map((child) => {
          return new Promise((resolve) => {
            client.dataService.register(child.path).subscribe({
              next: (data) => {
                // Use the first data received for initial config
                const deviceName = child.path.split(".").pop() || child.path;
                resolve({
                  name: deviceName,
                  config: {
                    addr1: data?.value?.addr1 ?? 0,
                    baud1: data?.value?.baud1 ?? 0,
                    check1: data?.value?.check1 ?? 0,
                    stopBit1: data?.value?.stopBit1 ?? 0,
                    baud2: data?.value?.baud2 ?? 0,
                    check2: data?.value?.check2 ?? 0,
                    stopBit2: data?.value?.stopBit2 ?? 0,
                  },
                  path: child.path,
                });
              },
              error: () => {
                // On error, fallback to default config
                const deviceName = child.path.split(".").pop() || child.path;
                resolve({
                  name: deviceName,
                  config: {
                    addr1: 0,
                    baud1: 0,
                    check1: 0,
                    stopBit1: 0,
                    baud2: 0,
                    check2: 0,
                    stopBit2: 0,
                  },
                  path: child.path,
                });
              },
            });
          });
        });

        Promise.all(devicePromises).then((devices) => {
          // Store and broadcast initial devices to clients
          latestSchemaDevices = devices.map(({ name, config }) => ({
            name,
            config,
          }));
          broadcast({ type: "schema", devices: latestSchemaDevices });
        });

        // No longer pushing default devices here
      },
      error: async (error) => {
        console.error(
          "Schema Error at",
          new Date().toISOString(),
          ":",
          error && error.message ? error.message : error
        );
        await client.disconnect();
        setTimeout(initializeWDXClient, 5000); // Retry after 5 seconds
      },
      complete: () => {
        console.log(
          "Schema subscription completed at",
          new Date().toISOString()
        );
      },
    });
  } catch (e) {
    console.error(
      "Error initializing WDX client at",
      new Date().toISOString(),
      ":",
      e.message
    );
    console.error("Stack:", e.stack);
    setTimeout(initializeWDXClient, 5000); // Retry after 5 seconds
  }
};

// Start the WDX client
initializeWDXClient();
