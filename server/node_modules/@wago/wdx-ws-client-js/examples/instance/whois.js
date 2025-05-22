
/**
 * Elrest - WDX - WS - Client - JS - Example - Instance Whois
 * 
 * Retrieves Instances list from WDX with WS client.
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXWSClientConfiguration = require('../configuration/configuration.js');

(async () => {
    try {
        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );
        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');

        c.instanceService.whois('test-virtual').subscribe(
            {
                next: (instance) => {
                    console.log(instance);
                },

                error: async (error) => {
                    console.error('Error: ' + error.message);

                    await c.disconnect();
                    console.log('Disconnected successfully');
                },

                complete: async () => {
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
