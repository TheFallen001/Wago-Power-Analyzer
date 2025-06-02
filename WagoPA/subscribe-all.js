/**
 * Elrest - WDX - WS - Client - JS - Example - Subscribe All and Stop
 *
 * Subscribes to data values for all child nodes under the given path from WDX with WS client,
 * sets all switches to "on" at startup, and stops the program after completion.
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
(async () => {
  try {
    const WDXWSClient = require('@wago/wdx-ws-client-js');
    
    // Set up WebSocket client
    const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService({
      url: 'ws://192.168.31.204:7081/wdx/ws',
      reconnectAttempts: 5,
      reconnectDelay: 1000
    });

    console.log('Connecting to ws://192.168.31.204:7081/wdx/ws');
    await c.connect();
    console.log('Connected successfully');

    const path = 'Virtual';

    // Subscribe to schema and child nodes
    c.dataService.getSchema(path, 1).subscribe({
      next: (schema) => {
        console.log('Schema received for path:', path);
        for (const child of schema.children) {
          console.log('Subscribing to child path (switch on):', child.path);
          // Register each path to turn the switch "on"
          c.dataService.register(child.path).subscribe({
            next: (data) => {
              console.log(`Data for ${child.path}:`, data ? data.value : null);
            },
            error: (error) => {
              console.error(`Error subscribing to ${child.path}:`, error.message);
            },
            complete: () => {
              console.log(`Subscription completed for ${child.path}`);
            }
          });
        }

      },
      error: async (error) => {
        console.error('Schema Error:', error.message);
        await c.disconnect(); // Attempt disconnect on error
      },
      complete: () => {
        console.log('Schema subscription completed');
        // Disconnect and exit are handled in the next handler
      }
    });
  } catch (e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
    process.exit(1); // Stop with error code
  }
})();