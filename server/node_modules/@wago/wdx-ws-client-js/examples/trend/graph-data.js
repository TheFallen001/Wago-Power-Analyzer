/**
 * Elrest - WDX - WS - Client - JS - Example - Trends - Graph Detail Request
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
        // const graphData=await c.trendService.graphData('026e12d9-b402-40a8-9770-484f901ce310').toPromise();

        c.trendService.graphData('026e12d9-b402-40a8-9770-484f901ce310').subscribe(
            {
                next: (trend) => {
                    console.log('Response');
                    console.log(JSON.stringify(trend, null, 2));
                },

                error: async (error) => {
                    console.error('Error Code: ' + error.code);
                    console.error('Error Message: ' + error.message);
                    console.error('Error Stack: ' + error.stack);


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
