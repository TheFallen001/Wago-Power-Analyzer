
const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXWSClientConfiguration = require('../configuration/configuration.js');
const WDXSchema = require('@wago/wdx-schema');
const WDXSettings = require('./settings');
const WDXContinue = require('./continue')

module.exports.initLights = async () => {
    try {

        WDXSettings.title();
        WDXSettings.copyright();

        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );
        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');

        WDXSettings.lineSeparator();
        console.log(`${WDXSettings.indentation()}WDX WS Client - Connected successfully`);

        WDXSettings.lineSeparator();

        module.exports.subtitle();
        module.exports.content();

        WDXSettings.lineSeparator();


        await WDXContinue.continue();

        const schemas = WDXSettings.getDataSchemas();

        console.log(`\n${WDXSettings.indentation()}Storing Data Schemas - Total count ${schemas.length}`);
        console.log(`\n${WDXSettings.indentation()}Please wait ...`);

        const position = await WDXSettings.getCursorPos();
        position.rows -= 1;

        const totalCount = schemas.length;
        let currentCount = 1;

        for (const schema of schemas) {
            try {
                await c.dataService.setSchema(schema).toPromise();
                process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K    Schema ${schema.path} saved successfully ${currentCount} / ${totalCount}.`);
                currentCount += 1;
            } catch (err) {
                console.error(err);
            }
        }

        process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K`);

        console.log(`\n${WDXSettings.indentation()}Storing schemas - Done`);

        console.log(`\n${WDXSettings.indentation()}WDX Schema tree: ${WDXSettings.wdxUrlPrefix()}/data/tree`);
        console.log(`${WDXSettings.indentation()}WDX Exmple Hotel Lights: ${WDXSettings.wdxUrlPrefix()}/showooms/hotel-virtual?width=${WDXSettings.rooms}&height=${WDXSettings.floors}`);


        await c.disconnect();
        WDXSettings.lineSeparator();

        await WDXContinue.continue();

    } catch (e) {
        console.error('Error: ' + e.message);
        console.error('Error: ' + e.stack);
        process.exit(1);
    }
};

module.exports.subtitle = () => {
    console.log(`${WDXSettings.indentation()}Step 2. Hotel rooms lights color data schema`);
};

module.exports.content = () => {
    console.log(`\n${WDXSettings.indentation()}In this step we will initialize hotel rooms light data schemas on Virtual Data Adapters for each room. New schemas will be created using WDX WS Client JS dataService. Schemas will be created on each data adapter as simple schema containing light color value initialized with empty value.`);
};

