/**
 * Elrest - WDX - WS - Client - JS - Example - Chart - Detail Request
 * 
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */


(async () => {
    try {

        const WDXWSClient = require('@wago/wdx-ws-client-js');
        const WDXWSClientConfiguration = require('../configuration/configuration.js');
        const WDXExampleChart = require('./chart.json');

        console.log(`WDX Chart - Detail Request: ${WDXExampleChart.uuid}`);

        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );

        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');


        c.chartService.detail(WDXExampleChart.uuid).subscribe(
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
        console.error('Error: ' + e.stack);
    }
})();
