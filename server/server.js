/**
 * Node.js Intermediary Server for WDX WebSocket
 * Connects to WDX server and forwards data to React Native clients
 */
const WDXWSClient = require("@wago/wdx-ws-client-js");
const WebSocket = require("ws");
const { DataService } = require("./services/DataService.js");
const WDXWSClientConfiguration = require("@wago/wdx-ws-client-js");
const Model = require("./dist");
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
            // The correct path for each config key is message.path + '.' + wdxKey (e.g., Virtual.Virt.Addr1)
            const valuePath = `${message.path}.${wdxKey}`;
            console.log(`[WDX setValue] Attempting to set`, {
              path: valuePath,
              key: wdxKey,
              value,
            });
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
                broadcast({
                  type: "data",
                  path: valuePath,
                  value: { [wdxKey]: value },
                });
                // After a successful update, restart the schema subscription to get fresh values from WDX
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
        /* FIXME: wait for Slavomir to respond and do what he says */
        if (
          client &&
          client.instanceService &&
          typeof client.instanceService.save === "function"
        ) {
          const name = "Virt3";
          const instance =
            Model.Instance.DataAdapter.VirtualDataAdapterInstance();
            instance.name = name;
            instance.type = "Virtual";
            
          client.instanceService.save(instance).subscribe({
            next: (result) => {
              console.log("DIsplaying the Next Function result: ", result);
            },
            complete: (result) => {
              console.log("On Complete: ", result);
            }, 
            error: (result) => {
              console.log("The error encountered: ", result);
              console.log("Instance used: ", instance);
            }
          });
        } else {
          console.error(
            "InstanceService not available or save method not found"
          );
        }
      } else if (message.type === "getLogs") {
        // TODO: wait for SLavomir's response
        if (client && client.runtimeService) {
          response = client.runtimeService.monitorSubscribe().subscribe({
            next: (logs) => {
              console.log("Message Received after Next: ", logs);
              broadcast({ type: "sendLogs", logs });
            },
            error: (message) => {
              console.log("Message received after Error: ", message);
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
      url: "ws://192.168.0.101:7081/wdx/ws",
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
      "Connecting to WDX server at ws://192.168.0.101:7081/wdx/ws at",
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
          error.message
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
