/**
 * Elrest - WDX - WS - Client - JS - Example - Data Get Value
 * 
 * Retrieves Data Value for given path from WDX with WS client.
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */

const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXWSClientConfiguration = require('../../configuration/configuration.js');

(async () => {
    try {
        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );

        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');

        const path = 'Virtual.store.c';

        c.dataService.getValue(path).subscribe(
            {
                next: (response) => {
                    console.log('Response');
                    console.log(JSON.stringify(response, null, 2));
                },

                error: async (error) => {
                    console.error('Error: ' + error);

                    console.log('Disconnecting');
                    await c.disconnect();
                    console.log('Disconnected successfully');
                },

                complete: async () => {
                    console.log('Completed');
                    console.log('Disconnecting');
                    await c.disconnect();
                    console.log('Disconnected successfully');
                }
            },
        );

    } catch (e) {
        console.error('Error: ' + e.message);
        console.error('Error: ' + e.stack);
    }
})();
