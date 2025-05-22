
const WDXJSWSClient = require('@wago/wdx-ws-client-js');
const WDXSchema = require('@wago/wdx-schema');
const WDXSettings = require('./settings');
const WDXContinue = require('./continue');
const WDXWSClientConfiguration = require('../configuration/configuration.js');


module.exports.initTrends = async () => {
    try {
        WDXSettings.title();
        WDXSettings.copyright();

        const c = new WDXJSWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );
        console.log('Connecting');
        await c.connect();
        console.log('Connected successfully');
        WDXSettings.lineSeparator();


        module.exports.subtitle();
        module.exports.content();

        WDXSettings.lineSeparator();

        console.log(`\n${WDXSettings.indentation()}1. Create statistics Virtual data store instance of Virtual Data Adapter, where we will store actual values with scripts initialized in nexts steps of this example.`);
        await WDXContinue.continue();

        console.log(`${WDXSettings.indentation()}Creating and starting Stats Virtual Data Adapter ...`);
        await c.instanceService.save(WDXSettings.getTrendStatsInstance()).toPromise();
        await c.instanceService.start(WDXSettings.getTrendStatsInstance().uuid).toPromise();
        console.log(`${WDXSettings.indentation()}Done`);

        console.log(`\n${WDXSettings.indentation()}2. Create statistics Virtual data store schema, where we will store calculated counts.`);

        await WDXContinue.continue();

        console.log(`${WDXSettings.indentation()}Creating Stats Data Schemas ...`);

        const schemas = WDXSettings.getTrendStatsSchema();

        let position = await WDXSettings.getCursorPos();
        position.rows -= 1;

        let totalCount = schemas.length;
        let currentCount = 1;

        for (const schema of schemas) {
            try {
                await c.dataService.setSchema(schema).toPromise();

                process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K${WDXSettings.indentation()}Schema ${schema.name} saved successfully ${currentCount} / ${totalCount}.`);
                currentCount += 1;
            } catch (e) {
                console.error(e);
            }

        }
        console.log(`${WDXSettings.indentation()}Done`);

        console.log(`\n${WDXSettings.indentation()}3. Create trend with WDX WS Client JS implementation of trendService.`);
        await WDXContinue.continue();

        console.log(`${WDXSettings.indentation()}Creating Trends ...`);
        const trends = WDXSettings.getTrends();

        position = await WDXSettings.getCursorPos();
        position.rows -= 1;

        totalCount = trends.length;
        currentCount = 1;

        for (const trend of trends) {
            try {
                const result = await c.trendService.save(trend).toPromise();
                process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K${WDXSettings.indentation()}Trend ${trend.name} saved successfully ${currentCount} / ${totalCount}.`);
                currentCount = currentCount + 1;
            } catch (e) {
                console.error(e);
            }

        }
        console.log(`${WDXSettings.indentation()}Done`);

        WDXSettings.lineSeparator();

        await c.disconnect();

        await WDXContinue.continue();

    } catch (e) {
        console.error('Error initTrends: ' + e.message);
        console.error('Error initTrends: ' + e.stack);
        process.exit(1);
    }
};


module.exports.subtitle = () => {
    console.log(`${WDXSettings.indentation()}Step 4. Hotel rooms lights color trend`);
};

module.exports.content = () => {
    console.log(`\n${WDXSettings.indentation()}This step will create two trends for counting current colors counts for all rooms and total color count presented in all rooms.`);

    console.log(`\n${WDXSettings.indentation()}1. Create statistics Virtual data store instance of Virtual Data Adapter, where we will store actual values with scripts initialized in nexts steps of this example.`);

    console.log(`\n${WDXSettings.indentation()}2. Create statistics Virtual data store schema, where we will store calculated counts.`);

    console.log(`\n${WDXSettings.indentation()}3. Create trend with WDX WS Client JS implementation of trendService.`);


};

