/**
 * Elrest - WDX - WS - Client - JS - Example - Subscribe Data Value Changes
 * 
 * Subscribes for Data Value changes for given data schema path from WDX with WS client.
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

        const path = 'Virtual.farel.MonthlyProduction';
        const regressionDataPath = 'Virtual.farel.MonthlykWhProduction';

        c.dataService.register(path).subscribe(
            {
                next: async (response) => {
                    console.log('Virtual.farel.MonthlyProduction changed', response.value);
                    const data = { "energyConsuption": 0, "production": response.value };
                    console.log('Virtual.farel.MonthlykWhProduction calculated to', response.value);
                    await c.dataService.setValue(regressionDataPath, JSON.stringify(data)).toPromise();
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
                }
            },
        );

    } catch (e) {
        console.error('Error: ' + e.message);
        console.error('Error: ' + e.stack);
    }
})();
