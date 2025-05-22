
/**
 * Elrest - WDX - WS - Client - JS - Example - Chart - Subscribe Request
 * 
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */

(async () => {
    try {

        const WDXWSClient = require('@wago/wdx-ws-client-js');
        const WDXWSClientConfiguration = require('../configuration/configuration.js');
        const WDXExampleChart = require('./chart.json');

        console.log(`WDX Chart - Subscribe Request: ${WDXExampleChart.uuid}`);

        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );

        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');

        c.chartService.register(WDXExampleChart.uuid).subscribe(
            {
                next: (response) => {
                    console.log('Response');
                    console.log(JSON.stringify(response, null, 2));
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
