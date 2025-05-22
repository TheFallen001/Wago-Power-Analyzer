/**
 * Elrest - WDX - WS - Client - JS - Example - Create Alarm
 * 
 * Creates a new alarm in WDX with WS client.
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */

const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXWSClientConfiguration = require('../configuration/configuration.js');
const WDXSchema = require('@wago/wdx-schema');

(async () => {
    try {
        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );
        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');

        const alarm = new WDXSchema.WDX.Schema.Model.Alarm.Alarm();
        alarm.name ='WDX - Examples - Alarms - Virtual.virtual-store.test no empty';
        alarm.enabled = true;
        alarm.code = 33333333;
        alarm.classification = WDXSchema.WDX.Schema.Model.Alarm.AlarmClassification.ERROR;
        alarm.type = WDXSchema.WDX.Schema.Model.Alarm.AlarmType.WITHOUT_ACKNOWLEDGE;
        alarm.uuid = 'a37a75f2-8f1c-11ef-b4ad-088fc37eff34';

        c.alarmService.save(alarm).subscribe(
            {
                next: (alarm) => {
                    console.log('Response');
                    console.log(JSON.stringify(alarm, null, 2));
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
