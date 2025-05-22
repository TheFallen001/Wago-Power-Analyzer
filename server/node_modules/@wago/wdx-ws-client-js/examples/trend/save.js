/**
 * Elrest - WDX - WS - Client - JS - Example - Trends - Detail Request
 * 
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */

const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXSchema = require('@wago/wdx-schema');
const WDXWSClientConfiguration = require('../configuration/configuration.js');

(async () => {
    try {
        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );
        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');

        const trend=new WDXSchema.WDX.Schema.Model.Trend.Trend(
            "Example Virtual Store Test Variable", //name
            1000, // dataPoolInterval
            true, //active
            true, //showLines
            true, //showLabels
            true, //intervalPicker
            true, //exportCurrentViewButton
            true, //exportFullDataButton,
            true, //resetButton
            true, //legend
            true, //tooltips
            true, //extendedTouchFeatures
            true, //zoom
            new WDXSchema.WDX.Schema.Model.Trend.XAxis(
                "Time", //label
                undefined, //format
                WDXSchema.WDX.Schema.Model.Trend.DefaultFormat.HumanReadable, // defaultFormat
                true, // visible
            ),
            [
                new WDXSchema.WDX.Schema.Model.Trend.YAxis(
                    "ed1c1338-6fbe-4bdd-ad76-853aa951a8a7", //uuid
                    undefined, //id
                    "Value", //name
                    "Value", //label
                    undefined,//min
                    undefined, //max
                    WDXSchema.WDX.Schema.Model.Trend.YAxisPostion.LEFT, //position
                    undefined, //format
                    '#000000', //color
                    true, //visible
                ),
            ], // yAxis
            [
                new WDXSchema.WDX.Schema.Model.Trend.DataSet(
                    "0e7e12ef-d9c7-48a9-ae98-f4b33b35d64f",
                    "test", //name
                    "test", //label
                    "Virtual.virtual-store.test", //dataSchemaPath
                    "#00ff19", //color
                    "ed1c1338-6fbe-4bdd-ad76-853aa951a8a7", //yAxis
                    true, //enabled
                    true, //visible
                ),
            ], //dataset
            undefined, //createDateTime
            undefined, // updatedDateTime
            '949d9259-8756-45f7-a7b9-cc8e661d2257', //uuid
        );

        c.trendService.save(trend).subscribe(
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
