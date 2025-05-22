/**
 * Elrest - WDX - WS - Client - JS - Example - Refresh Data Schema
 * 
 * Refreshes Data Schema for given path from WDX with WS client. Usable when data is connected WDX - Data Adapter to IOT which dynamically changes data schema.
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */

const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXSchema = require('@wago/wdx-schema');
const WDXWSClientConfiguration = require('../../configuration/configuration.js');

(async () => {
    try {
        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );
        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');

        const schema = new WDXSchema.WDX.Schema.Model.Data.DataSchema();
        schema.path = 'Virtual.store.c';
        schema.relativePath = 'c';
        schema.readonly = false;
        schema.subscribeable = true;
        schema.expandable = false;
        schema.extendable = false;
        schema.editable = true;
        schema.removable = true;
        schema.refreshable = false;
        schema.metadata = new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual();

        c.dataService.setSchema(schema).subscribe(
            {
                next: (schema) => {
                    console.log(JSON.stringify(schema, null, 2));
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
