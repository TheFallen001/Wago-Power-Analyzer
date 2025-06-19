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
const virtualDeviceService  = require("./services/VirtualDeviceService.js");
const { ModbusDeviceService } = require("./services/ModbusDeviceService.js");

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
      console.log("Message Path: ", message.path);
      // Delegate to Virtual or Modbus service based on message
      if (message.path && message.path.startsWith("Virtual.")) {
        virtualDeviceService.handleMessage(message, ws, client, broadcast);
        
      } else if (message.path && message.path.startsWith("Modbus.")) {
        ModbusDeviceService.handleMessage(message, ws, client, broadcast);
      } else if (message.device && message.device.type === "Virtual") {
        VirtualDeviceService.handleMessage(message, ws, client, broadcast);
      } else if (message.device && message.device.type === "Modbus") {
        ModbusDeviceService.handleMessage(message, ws, client, broadcast);
      } else if (message.type === "getLogs") {
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
      url: "ws://192.168.31.243:7481/wdx/ws",
      reconnectAttempts: 5,
      reconnectDelay: 1000,
    },
    WDXWSClientConfiguration.wsConfiguration
  );

  // Attach DataService to client for backend operations, passing the client instance
  client.dataService = new DataService(client);
  client.instanceService = new WDXWSClient.WDX.WS.Client.JS.Service.InstanceService(client);

  client.runtimeService =
    new WDXWSClient.WDX.WS.Client.JS.Service.RuntimeService(client);

  try {
    console.log(
      "Connecting to WDX server at ws://192.168.31.243:7481/wdx/ws at",
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
