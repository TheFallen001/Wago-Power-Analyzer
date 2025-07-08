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
const { server, serverSocket, holding } = require("./ModbusSim.js");
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
      // if (message.path && message.path.startsWith("Virtual.")) {
      //   virtualDeviceService.handleMessage(
      //     message,
      //     ws,
      //     client,
      //     broadcast
      //   );
      // } else if (message.path && message.path.startsWith("MODBUS.")) {
      //   modbusDeviceService.handleMessage(
      //     message,
      //     ws,
      //     client,
      //     broadcast
      //   );
      // } else
      if (message.device && message.device.deviceType === "Virtual") {
        virtualDeviceService.handleMessage(message, ws, client, broadcast);
      } else if (message.device && message.device.deviceType === "MODBUS") {
        modbusDeviceService.handleMessage(message, ws, client, broadcast);
      } else if (message.type === "getLogs") {
        if (client && client.instanceService) {
          
          client.instanceService.whois(message.deviceName).subscribe({
            next: (response) => {
              client.instanceService.listLogs(response.uuid, 1, 2).subscribe({
                next: (response) => {
                  // Response's Attributes: [ 'items', 'total', 'currentPage', 'totalPages' ]

                  ws.send(
                    JSON.stringify({
                      type: "updateLogs",
                      logs: JSON.stringify(
                        response.items.slice(0, 10),
                        null,
                        2
                      ),
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
              console.error("Who is Error: ", error);
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
    reconnectDelay: 2000,
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

    // The direct children of MODBUS are the devices
    const deviceNodes = schema.children || [];
    if (!Array.isArray(deviceNodes) || deviceNodes.length === 0) {
      console.log(
        "No device nodes found in schema at",
        new Date().toISOString()
      );
      return;
    }

    // For each device node, collect its children as config fields
    // Instead of map, use for loop and delay each subscribe by 1 second
    const configFields = [
      "Addr1",
      "645Addr",
      "Baud1",
      "Baud2",
      "Check1",
      "Check2",
      "Language",
      "F",
      "PF",
      "QT",
      "PT",
      "UA",
      "IA",
      "lat",
      "lng",
    ];
    const devices = [];
    for (let i = 0; i < deviceNodes.length; i++) {
      const deviceNode = deviceNodes[i];
      const deviceName = deviceNode.path.split(".").pop() || deviceNode.path;
      try {
        const config = {};
        for (let j = 0; j < configFields.length; j++) {
          const field = configFields[j];
          const fieldPath = `MODBUS.${deviceName}.${field}`;
          console.log(
            `[${deviceName}] Attempting to subscribe to: ${fieldPath}`
          );
          await new Promise((resolve) => {
            let resolved = false;
            const timeout = setTimeout(() => {
              if (!resolved) {
                resolved = true;
                console.warn(
                  `[${deviceName}] Timeout waiting for value on ${fieldPath}, using default.`
                );
                config[field] =
                  field === "lat" ? 40.0 : field === "lng" ? 30.0 : 0;
                resolve();
              }
            }, 100);
            const sub = client.dataService.register(fieldPath).subscribe({
              next: (data) => {
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeout);
                  console.log(
                    `[${deviceName}] Received value for ${fieldPath}:`,
                    JSON.stringify(data, null, 2)
                  );
                  config[field] =
                    data?.value ??
                    (field === "lat" ? 40.0 : field === "lng" ? 30.0 : 0);
                  resolve();
                }
              },
              error: (err) => {
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeout);
                  console.error(
                    `[${deviceName}] Error subscribing to ${fieldPath}:`,
                    err
                  );
                  config[field] =
                    field === "lat" ? 40.0 : field === "lng" ? 30.0 : 0;
                  resolve();
                }
              },
            });
          });
          // Delay 1 second between each field subscribe for this device
          await new Promise((r) => setTimeout(r, 100));
        }
        devices.push({ name: deviceName, config, path: deviceNode.path });
        // Log row by row after each device
        console.log(
          `[${deviceName}] Config collected:`,
          JSON.stringify(config, null, 2)
        );
      } catch (err) {
        console.error(
          "Error getting schema for device",
          deviceNode.path,
          ":",
          err
        );
        devices.push({ name: deviceName, config: {}, path: deviceNode.path });
      }
    }
    latestSchemaDevices = devices.map(({ name, config }) => ({ name, config }));
    broadcast({ type: "schema", devices: latestSchemaDevices });
  } catch (e) {
    console.error(
      "Error initializing WDX client at",
      new Date().toISOString(),
      ":",
      e.message
    );
    console.error("Stack:", e.stack);
    setTimeout(initializeWDXClient, 100); // Retry after 5 seconds
  }
};

holding.writeUInt16BE(1234, 4102 * 2); // Just an example

// Start server
serverSocket.listen(1502, () => {
  console.log("✅ Modbus TCP server listening on port 1502");
});

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

// ---
// Ensure that only Modbus devices are included in the schema broadcast and device updates
// This is already handled by using the MODBUS schema and by broadcasting only those devices.
// If you want to see the current list of Modbus devices, you can log them here:

setInterval(() => {
  if (latestSchemaDevices && latestSchemaDevices.length > 0) {
    console.log(
      "Current Modbus devices:",
      latestSchemaDevices.map((d) => d.name)
    );
  }
}, 10000); // Log every 10 seconds
