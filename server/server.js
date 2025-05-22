/**
 * Node.js Intermediary Server for WDX WebSocket
 * Connects to WDX server and forwards data to React Native clients
 */
const WDXWSClient = require('@wago/wdx-ws-client-js');
const WebSocket = require('ws');

// Set up WebSocket server for React Native clients
const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server started on ws://localhost:8080');

// Store connected clients
const clients = new Set();

// Store the latest schema for new clients
let latestSchemaDevices = [];

wss.on('connection', (ws) => {
  console.log('New React Native client connected at', new Date().toISOString());
  clients.add(ws);

  // Send latest schema to new client
  if (latestSchemaDevices.length > 0) {
    console.log('Sending latest schema to new client');
    const messageString = JSON.stringify({ type: 'schema', devices: latestSchemaDevices });
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(messageString);
      console.log('Sent initial schema:', messageString);
    }
  }

  ws.on('close', () => {
    console.log('React Native client disconnected at', new Date().toISOString());
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('Client WebSocket error at', new Date().toISOString(), ':', error.message);
    clients.delete(ws);
  });
});

// Broadcast message to all connected clients
const broadcast = (message) => {
  const messageString = JSON.stringify(message);
  console.log('Broadcasting message to clients at', new Date().toISOString(), ':', messageString);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    } else {
      console.log('Client not in OPEN state, removing:', client.readyState);
      clients.delete(client);
    }
  });
};

// Initialize WDX client
const initializeWDXClient = async () => {
  const client = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService({
    url: 'ws://192.168.31.175:7081/wdx/ws',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
  });

  try {
    console.log('Connecting to WDX server at ws://192.168.31.175:7081/wdx/ws at', new Date().toISOString());
    await client.connect();
    console.log('Connected successfully to WDX server at', new Date().toISOString());

    const path = 'Virtual';

    // Subscribe to schema
    client.dataService.getSchema(path, 1).subscribe({
      next: (schema) => {
        console.log('Schema received for path:', path, 'at', new Date().toISOString());
        const children = schema.children || [];
        if (!Array.isArray(children) || children.length === 0) {
          console.log('No children found in schema or invalid schema data at', new Date().toISOString());
          return;
        }

        console.log('Schema children:', children);
        const devices = [];
        const devicePathMap = {};

        children.forEach((child) => {
          const deviceName = child.path.split('.').pop() || child.path;
          console.log(`Processing child device: ${deviceName}, path: ${child.path} at`, new Date().toISOString());
          devicePathMap[deviceName] = child.path;
          devices.push({
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
          });
        });

        // Store and broadcast initial devices to clients
        latestSchemaDevices = devices;
        broadcast({ type: 'schema', devices });

        // Subscribe to all child nodes
        children.forEach((child) => {
          console.log(`Subscribing to child node: ${child.path} at`, new Date().toISOString());
          client.dataService.register(child.path).subscribe({
            next: (data) => {
              console.log(`Data for ${child.path}:`, data ? data.value : null, 'at', new Date().toISOString());
              // Broadcast data updates to clients
              broadcast({ type: 'data', path: child.path, value: data ? data.value : null });
            },
            error: (error) => {
              console.error(`Error subscribing to ${child.path} at`, new Date().toISOString(), ':', error.message);
            },
            complete: () => {
              console.log(`Subscription completed for ${child.path} at`, new Date().toISOString());
            },
          });
        });
      },
      error: async (error) => {
        console.error('Schema Error at', new Date().toISOString(), ':', error.message);
        await client.disconnect();
        setTimeout(initializeWDXClient, 5000); // Retry after 5 seconds
      },
      complete: () => {
        console.log('Schema subscription completed at', new Date().toISOString());
      },
    });
  } catch (e) {
    console.error('Error initializing WDX client at', new Date().toISOString(), ':', e.message);
    console.error('Stack:', e.stack);
    setTimeout(initializeWDXClient, 5000); // Retry after 5 seconds
  }
};

// Start the WDX client
initializeWDXClient();