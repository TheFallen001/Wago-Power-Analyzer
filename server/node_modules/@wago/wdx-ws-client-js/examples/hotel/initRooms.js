
const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXWSClientConfiguration = require('../configuration/configuration.js');
const WDXSettings = require('./settings');
const WDXContinue = require('./continue');

module.exports.initRooms = async () => {

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

        const instances = WDXSettings.getInstances();

        console.log(`\n${WDXSettings.indentation()}Storing Instances - Total count ${instances.length}`);
        console.log(`${WDXSettings.indentation()}Please wait ...`);

        const position = await WDXSettings.getCursorPos();
        position.rows -= 1;

        const totalCount = instances.length;
        let currentCount = 1;
        for (const instance of instances) {
            try {
                await c.instanceService.save(instance).toPromise();
                await c.instanceService.restart(instance.uuid).toPromise();
                process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K    Instance ${instance.name} started successfully ${currentCount} / ${totalCount}.`);
                currentCount += 1;
            } catch (e) {
                console.error(e);
            }
        }

        process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K`);

        console.log(`${WDXSettings.indentation()}Storing Instances - Done`);
        console.log(`${WDXSettings.indentation()}WDX Instances list: ${WDXSettings.wdxUrlPrefix()}/instance/list\n`);

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
    console.log(`${WDXSettings.indentation()}Step 1. Hotel rooms lights data adapters`);
};


module.exports.content = () => {
    console.log(`\n${WDXSettings.indentation()}In this step we will initialize hotel rooms light data adapters as Virtual Data Adapters for each room. New instances will be created and started using WDX WS Client JS instanceService.`);
};
