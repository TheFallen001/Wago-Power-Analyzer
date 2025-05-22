

const WDXJSWSClient = require('@wago/wdx-ws-client-js');
const WDXSchema = require('@wago/wdx-schema');
const WDXSettings = require('./settings');
const WDXContinue = require('./continue');
const WDXWSClientConfiguration = require('../configuration/configuration.js');

/**
 * Map of colors and count
 */
const currentCount = new Map();


/**
 * Map of colors and count
 */
const totalCount = new Map();

/**
 * Map of path and current colors
 */
const currentState = new Map();

module.exports.scripts = async () => {
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


        module.exports.title();
        WDXSettings.lineSeparator();
        module.exports.content();
        WDXSettings.lineSeparator();

        console.log(`\n${WDXSettings.indentation()}2. Hotel lights game is prepared`);
        console.log(`${WDXSettings.indentation()}WDX Hotel Lights: ${WDXSettings.wdxUrlPrefix()}/showooms/hotel-virtual?width=${WDXSettings.rooms}&height=${WDXSettings.floors}`);


        await WDXContinue.continue();

        async function onLightUpdate(dataValue) {

            const colorName = dataValue.value ? dataValue.value.replace('#', '') : null;
            currentState.set(dataValue.path, colorName);

            await calculateCurrentCount();
            await calculateTotalCount(dataValue);

            process.stdout.write(`\u001b[${position.rows + 1};${position.cols}H\u001b[K${WDXSettings.indentation()}Current counts`);
            process.stdout.write(`\u001b[${position.rows + 2};${position.cols}H\u001b[K`);
            console.table(currentCount);


            process.stdout.write(`\u001b[${position.rows + 14};${position.cols}H\u001b[K${WDXSettings.indentation()}Total counts`);
            process.stdout.write(`\u001b[${position.rows + 15};${position.cols}H\u001b[K`);
            console.table(totalCount);
        }

        async function calculateCurrentCount() {

            for (const color of WDXSettings.colors) {
                currentCount.set(color, 0);
            }

            currentState.forEach((value, key) => {
                if (value) {
                    currentCount.set(value, currentCount.get(value) + 1);
                }
            });

            for (const color of WDXSettings.colors) {
                const path = `Virtual.stats.current.${color}`;
                const value = currentCount.get(color);

                await c.dataService.setValue(path, value).toPromise();
            }
        }

        async function calculateTotalCount(dataValue) {
            const colorName = dataValue.value ? dataValue.value.replace('#', '') : null;
            if (totalCount.has(colorName)) {
                totalCount.set(colorName, (totalCount.get(colorName) + 1));

                const path = `Virtual.stats.total.${colorName}`;
                const value = totalCount.get(colorName);

                await c.dataService.setValue(path, value).toPromise();
            }
        }

        const position = await WDXSettings.getCursorPos();
        position.rows -= 1;

        for (const color of WDXSettings.colors) {
            const totalCountPath = `Virtual.stats.total.${color}`;
            const totalCountValue = await c.dataService.getValue(totalCountPath).toPromise();
            totalCount.set(color, parseInt(totalCountValue.value ?? 0));
        }

        for (let floor = 1; floor <= WDXSettings.floors; floor++) {
            for (let room = 1; room <= WDXSettings.rooms; room++) {

                const name = `hotel-light-floor-${floor}-room-${room}`;
                const path = `Virtual.${name}.color`;

                process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K${WDXSettings.indentation()}Subscribing ${path} `);

                c.dataService.register(path).subscribe(
                    {
                        next: async (dataValue) => {
                            process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K${WDXSettings.indentation()}Data Update : ${dataValue.path}=${dataValue.value}`);

                            await onLightUpdate(dataValue);
                        },

                        error: async (error) => {
                            console.error('Error: ' + error.message);

                            await c.disconnect();
                            console.log('Disconnected successfully');
                        },

                        complete: async () => {
                            await c.disconnect();
                            console.log('Disconnected successfully');
                        }
                    },
                );
            }
        }

        process.stdout.write(`\u001b[${position.rows};${position.cols}H\u001b[K${WDXSettings.indentation()}Subscribing done`);

        while (await WDXContinue.continue()) {

        }

    } catch (e) {
        console.error('Error: ' + e.message);
        console.error('Error: ' + e.stack);
    }
};


module.exports.initCurrent = () => {
    console.clear();
    console.log(`${WDXSettings.indentation()}6.1. Running calculations current color count: `);
};

module.exports.initTotal = () => {
    console.clear();
    console.log(`${WDXSettings.indentation()}6.2. Running calculations total color count: `);
};


module.exports.title = () => {
    console.log(`${WDXSettings.indentation()}6. Running calculations scripts for trends datasets`);
};

module.exports.content = () => {
    console.log(`\n${WDXSettings.indentation()}In this step we will calculate trending data sets statistics. We will subscribe to all rooms colors and calculate current color counts and total color counts`);
};
