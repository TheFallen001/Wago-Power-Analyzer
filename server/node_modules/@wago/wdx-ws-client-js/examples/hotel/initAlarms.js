
const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXWSClientConfiguration = require('../configuration/configuration.js');
const WDXSchema = require('@wago/wdx-schema');
const WDXSettings = require('./settings');
const WDXContinue = require('./continue');

module.exports.initAlarms = async () => {
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


        WDXSettings.lineSeparator();

        module.exports.subtitle();
        module.exports.content();


        WDXSettings.lineSeparator();

        await WDXContinue.continue();

        const alarms = WDXSettings.getAlarms();

        console.log(`\n${WDXSettings.indentation()}Storing Alarms - Total count ${alarms.length}`);
        console.log(`\n${WDXSettings.indentation()}Please wait ...`);


        const position = await WDXSettings.getCursorPos();
        position.rows -= 1;

        const totalCount = alarms.length;
        let currentCount = 0;
        let errorCount = 0;

        for (const alarm of alarms) {
            try {
                await c.alarmService.save(alarm).toPromise();

                process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K    Alarm ${alarm.name} save successfully ${currentCount + 1} / ${totalCount}.`);
                currentCount += 1;
            } catch (e) {
                //console.error(e);
                errorCount += 1;
            }
        }

        console.log(`\n${WDXSettings.indentation()}Storing alarms - Done ${currentCount} / ${totalCount} Succeeded,  ${errorCount} Failed,`);
        console.log(`\n${WDXSettings.indentation()}WDX Alarm list: ${WDXSettings.wdxUrlPrefix()}/alarms/list\n`);

        console.log(`${WDXSettings.indentation()}WDX Exmple Hotel Lights: ${WDXSettings.wdxUrlPrefix()}/showooms/hotel-virtual?width=${WDXSettings.rooms}&height=${WDXSettings.floors}\n`);

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
    console.log(`${WDXSettings.indentation()}Step 3. Hotel rooms lights color alarm.`);
};

module.exports.content = () => {
    console.log(`\n${WDXSettings.indentation()}In this step we will initialize alarms for all hotel rooms light color data schemas on Virtual Data Adapters. Alarm will contain condition for light color is not empty.`);
};
