/**
 * Elrest - WDX - WS - Client - JS - Example - Trends - Graph Configuration Request
 * 
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



        // Call in one line or subscribe service Observable response.
        // const graphData=await c.trendService.graphConfiguration('949d9259-8756-45f7-a7b9-cc8e661d2257').toPromise();

        c.trendService.graphConfiguration('949d9259-8756-45f7-a7b9-cc8e661d2257').subscribe(
            {
                next: (trend) => {
                    console.log('Response');
                    console.log(JSON.stringify(trend, null, 2));
                },

                error: async (error) => {
                    console.error('Error Code: ' + error.code);
                    console.error('Error Message: ' + error.message);

                    console.log('Disconnecting');
                    await c.disconnect();
                    console.log('Disconnected successfully');
                },

                complete: async () => {
                    console.log('Completed');
                    console.log('Disconnecting');
                    await c.disconnect();
                    console.log('Disconnected successfully');
                },
            },
        );

    } catch (e) {
        console.error('Error: ' + e.message);
        //console.error('Error: ' + e.stack);
    }
})();
