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
const virtualDeviceService = require("./services/VirtualDeviceService.js");
const modbusDeviceService = require("./services/ModbusDeviceService.js");
const readline = require("readline");

// Set up WebSocket server for React Native clients

const IPADDRESS = "localhost";
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

      // Delegate to Virtual or Modbus service based on message
      if (message.path && message.path.startsWith("Virtual.")) {
        virtualDeviceService.handleMessage(
          message,
          ws,
          client,
          initializeWDXClient
        );
      } else if (message.path && message.path.startsWith("MODBUS.")) {
        console.log("Its true here");
        modbusDeviceService.handleMessage(
          message,
          ws,
          client,
          initializeWDXClient
        );
      } else if (message.device && message.device.deviceType === "Virtual") {
        virtualDeviceService.handleMessage(
          message,
          ws,
          client,
          initializeWDXClient
        );
      } else if (message.device && message.device.deviceType === "MODBUS") {
        modbusDeviceService.handleMessage(
          message,
          ws,
          client,
          initializeWDXClient
        );
      } else if (message.type === "getLogs") {
        if (client && client.instanceService) {
          response = client.instanceService
            .whois(message.deviceName)
            .subscribe({
              next: (response) => {
                client.instanceService.listLogs(response.uuid).subscribe({
                  next: (response) => {
                    ws.send(
                      JSON.stringify({
                        type: "updateLogs",
                        logs: JSON.stringify(response, null, 2),
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

// Add async getSchema helper
const getSchema = async (schema, client) => {
  try {
    return await client.dataService.getSchema(schema.path, 1).toPromise();
  } catch (error) {
    console.error(`Schema not exists ${schema.path}`);
    return await client.dataService.setSchema(schema).toPromise();
  }
};

// Initialize WDX client
const initializeWDXClient = async () => {
  if (client) {
    try {
      await client.disconnect();
      console.log("Previous WDX client disconnected");
    } catch (err) {
      console.error("Error during disconnection: ", err);
    }
    client = null;
  }
  client = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService({
    url: `ws://${IPADDRESS}:7081/wdx/ws`,
    reconnectAttempts: 5,
    reconnectDelay: 1000,
  });

  // Attach DataService to client for backend operations, passing the client instance
  client.dataService = new DataService(client);
  client.instanceService =
    new WDXWSClient.WDX.WS.Client.JS.Service.InstanceService(client);

  client.runtimeService =
    new WDXWSClient.WDX.WS.Client.JS.Service.RuntimeService(client);

  try {
    console.log(
      `Connecting to WDX server at ws://${IPADDRESS}:7081/wdx/ws at`,
      new Date().toISOString()
    );
    await client.connect();
    console.log(
      "Connected successfully to WDX server at",
      new Date().toISOString()
    );

    const path = "MODBUS";

    // Use new getSchema helper
    const schemaObj = { path };
    const schema = await getSchema(schemaObj, client);
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

    // Helper to extract Virtual config with lowercase keys
    function getVirtualConfig(data) {
      return {
        addr1: data?.value?.addr1 ?? 0,
        baud1: data?.value?.baud1 ?? 0,
        check1: data?.value?.check1 ?? 0,
        stopBit1: data?.value?.stopBit1 ?? 0,
        baud2: data?.value?.baud2 ?? 0,
        check2: data?.value?.check2 ?? 0,
        stopBit2: data?.value?.stopBit2 ?? 0,
        lat: data?.value?.lat ?? 40.0,
        lng: data?.value?.lng ?? 30.0,
      };
    }

    // Helper to extract Modbus config with correct key casing
    function getModbusConfig(data) {
      return {
        Addr1: data?.value?.Addr1 ?? 0,
        Baud1: data?.value?.Baud1 ?? 0,
        Check1: data?.value?.Check1 ?? 0,
        Baud2: data?.value?.Baud2 ?? 0,
        Check2: data?.value?.Check2 ?? 0,
        "645Addr": data?.value?.["645Addr"] ?? 0,
        Language: data?.value?.Language ?? 0,
        // Add more fields as needed
      };
    }
    
    // Test value path for single value subscription
    // This is a test value path to ensure the client can subscribe to a single value
    /*
    const testValuePath = "MODBUS.Mod.Addr1";
    console.log("Attempting to subscribe to single value:", testValuePath);
    client.dataService.register(testValuePath).subscribe({
      next: (data) => {
        console.log(
          "Received value for",
          testValuePath,
          ":",
          JSON.stringify(data, null, 2)
        );
        broadcast({
          type: "modbusTestValue",
          path: testValuePath,
          value: data?.value ?? null,
        });
      },
      error: (err) => {
        console.error(
          "Error subscribing to single value",
          testValuePath,
          ":",
          err
        );
      },
    });
    */

    // New: For each device, get its schema and subscribe to each child value node
    const devicePromises = children.map(async (child) => {
      const deviceName = child.path.split(".").pop() || child.path;
      // client.dataService.register(child.path).subscribe({
      //   next: (data) => {
      //     // Use the first data received for initial config
      //     const deviceName = child.path.split(".").pop() || child.path;
      //     resolve({
      //       name: deviceName,
      //       config: {
      //         addr1: data?.value?.addr1 ?? 0,
      //         baud1: data?.value?.baud1 ?? 0,
      //         check1: data?.value?.check1 ?? 0,
      //         stopBit1: data?.value?.stopBit1 ?? 0,
      //         baud2: data?.value?.baud2 ?? 0,
      //         check2: data?.value?.check2 ?? 0,
      //         stopBit2: data?.value?.stopBit2 ?? 0,
      //         lat: data?.value?.lat ?? 40.0,
      //         lng: data?.value?.lng ?? 30.0,
      //       },
      //       path: child.path,
      //     });
      //   },
      //   error: () => {
      //     // On error, fallback to default config
      //     const deviceName = child.path.split(".").pop() || child.path;
      //     resolve({
      //       name: deviceName,
      //       config: {
      //         addr1: 0,
      //         baud1: 0,
      //         check1: 0,
      //         stopBit1: 0,
      //         baud2: 0,
      //         check2: 0,
      //         stopBit2: 0,
      //       },
      //       path: child.path,
      //     });
      //   },
      // });

      // --- async/await version below ---
      try {
        const deviceSchema = await getSchema({ path: child.path }, client);
        if (!deviceSchema.children || deviceSchema.children.length === 0) {
          console.warn("No children found for device", child.path);
          return { name: deviceName, config: {}, path: child.path };
        }
        const childrenArr = deviceSchema.children.slice();
        // console.log(`Device ${deviceName} children:`, childrenArr);
        // Only subscribe to value nodes (those with a value property or subscribeable true)
        const valueChildren = childrenArr.filter(
          (valChild) => valChild.value !== undefined || valChild.subscribeable === true || valChild.type === 'value'
        );
        let config = {};
        await Promise.all(
          valueChildren.map(
            (valChild) =>
              new Promise((resolve) => {
                // console.log('Processing child:', valChild);
                //console.log('Attempting to register:', valChild.path);
                const sub = client.dataService.register(valChild.path).subscribe({
                  next: (data) => {
                    console.log('Register resolved for:', valChild.path);
                    config[valChild.name] = data.value;
                    console.log(`Subscribed value for ${valChild.path}:`, data.value);
                    // Broadcast each value as soon as it is received
                    broadcast({
                      type: "deviceValue",
                      device: deviceName,
                      path: valChild.path,
                      value: data.value,
                      config,
                    });
                    sub.unsubscribe();
                    resolve();
                  },
                  error: (err) => {
                    console.error("Error subscribing to", valChild.path, ":", err);
                    sub.unsubscribe();
                    resolve();
                  },
                });
              })
          )
        );
        return { name: deviceName, config, path: child.path };
      } catch (err) {
        console.error("Error getting schema for device", child.path, ":", err);
        return { name: deviceName, config: {}, path: child.path };
      }
    });
    const devices = await Promise.all(devicePromises);
    latestSchemaDevices = devices.map(({ name, config }) => ({
      name,
      config,
    }));
    broadcast({ type: "schema", devices: latestSchemaDevices });
  
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

// Press 'r' to restart WDX client. in cases where updates arent showing in the app
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", async (str, key) => {
  if (key.name === "r") {
    console.log("Restarting CLient...");
    await initializeWDXClient();
  } else if (key.ctrl && key.name === "c") {
    console.log("Exiting server...");
    if (client) await client.disconnect();
    process.exit();
  }
});

// Example usage: Replace direct Virtual logic with VirtualDeviceService where appropriate
// For instance, when adding a device of type 'Virtual', use:
// VirtualDeviceService.addDevice(device);
// When adding a device of type 'Modbus', use:
// ModbusDeviceService.addDevice(device);

// In the WebSocket message handler, you can now route logic based on device type:
// if (message.type === "addDevice") {
//   if (message.device && message.device.type === "Virtual") {
//     VirtualDeviceService.addDevice(message.device);
//   } else if (message.device && message.device.type === "Modbus") {
//     ModbusDeviceService.addDevice(message.device);
//   }
// }
