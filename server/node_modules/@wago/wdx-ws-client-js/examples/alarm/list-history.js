/**
 * Elrest - WDX - WS - Client - JS - Example - List Alarm(s) History
 * 
 * Retrieve Single Alarm History, or All Alarms History list (when alarm id is not specified) from WDX with WS client.
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

        /**
         * 
         */
        // c.alarmService.listAlarmHistory(3335/** alarm code */)
        // pass Alarm UUID for specific alarm or list all alarms history
        c.alarmService.listAlarmHistory().subscribe(
            {
                next: (response) => {
                    console.log('Response');
                    console.log(JSON.stringify(response, null, 2));
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
        //console.error('Error: ' + e.stack);
    }
})();
