const path = require('node:path');
const fs = require('fs');
const WDXUUID = require('uuid');
const WDXSchema = require('@wago/wdx-schema');

const WDXWSClientConfiguration = require('../configuration/configuration.js');

module.exports.colors = [
    'f7d42e',
    '31a8fa',
    '38d759',
    'ec465e',
    'f9b73c',
    'ad68f7',
    'f6dd38',
];

module.exports.wsConfiguration = WDXWSClientConfiguration.wsConfiguration;

module.exports.floors = 10;
module.exports.rooms = 7;

module.exports.roomCount = () => {
    return module.exports.floors * module.exports.rooms;
};

module.exports.wdx = {
    protocol: 'http',
    host: 'localhost',
    port: '8081',
    path: '/wdx',
};

module.exports.getCursorPos = () => new Promise((resolve) => {
    const termcodes = { cursorGetPosition: '\u001b[6n' };

    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);

    const readfx = function () {
        const buf = process.stdin.read();
        const str = JSON.stringify(buf); // "\u001b[9;1R"
        const regex = /\[(.*)/g;
        const xy = regex.exec(str)[0].replace(/\[|R"/g, '').split(';');
        const pos = { rows: xy[0], cols: xy[1] };
        process.stdin.setRawMode(false);
        resolve(pos);
    }

    process.stdin.once('readable', readfx);
    process.stdout.write(termcodes.cursorGetPosition);
})

module.exports.wdxUrlPrefix = () => {
    const urlParts = [];
    if (undefined !== module.exports.wdx.protocol) {
        urlParts.push(`${module.exports.wdx.protocol}://`);
    } else {
        urlParts.push(`//`);
    }
    urlParts.push(`${module.exports.wdx.host}`);

    if (module.exports.wdx.port) {
        urlParts.push(`:${module.exports.wdx.port}`);
    }

    if (module.exports.wdx.path) {
        urlParts.push(`${module.exports.wdx.path}`);
    }
    return urlParts.join('');
};


module.exports.lineSeparator = (separator = '-') => {
    console.log(separator.repeat(process.stdout.columns));
};


module.exports.copyright = () => {
    console.log('\n    @copyright 2024 Elrest AutomationsSysteme GMBH');
};

module.exports.subtitle = () => {
    console.log('\n');
    console.log('     _       __ ____  _  __    ______                                __           ');
    console.log('    | |     / // __ \| |/ /   / ____/_  __ ____ _ ____ ___   ____   / /___   _____');
    console.log('    | | /| / // / / /|   /   / __/  | |/_// __ `// __ `__ \ / __ \ / // _ \ / ___/');
    console.log('    | |/ |/ // /_/ //   |   / /___ _>  < / /_/ // / / / / // /_/ // //  __/(__  ) ');
    console.log('    |__/|__//_____//_/|_|  /_____//_/|_| \__,_//_/ /_/ /_// .___//_/ \___//____/  ');
};

module.exports.content = () => {
    module.exports.lineSeparator();
    console.log('    Content');
    module.exports.lineSeparator();
    console.log('\n\t1. Hotel rooms lights data adapters.');
    console.log('\n\t2. Hotel rooms lights color data schema.');
    console.log('\n\t3. Hotel rooms lights color alarm.');
    console.log('\n\t4. Hotel rooms lights color trend.');
    console.log('\n\t5. Review results');
    console.log('\n\t6. Running calculations scripts for trends datasets');
    module.exports.lineSeparator();
};


module.exports.settings = () => {

    console.log('    Settings');
    module.exports.lineSeparator();

    console.log(`\n\t1. WDX Configuration`);
    console.log(`\t\tURL: ${module.exports.wdxUrlPrefix()}`);


    console.log(`\n\t2. WDX WS Client Configuration`);
    console.log(`\t\tprotocol: ${module.exports.wsConfiguration.protocol}`);
    console.log(`\t\thost    : ${module.exports.wsConfiguration.host}`);
    console.log(`\t\tport    : ${module.exports.wsConfiguration.port}`);
    console.log(`\t\tpath    : ${module.exports.wsConfiguration.path}`);
    console.log(`\t\turl     : ${module.exports.wsConfiguration.url}`);

    console.log(`\n\t3. Hotel has ${module.exports.floors} floors and on each floor has ${module.exports.rooms} rooms.`);
    console.log(`\t4. Hotel has in total ${module.exports.floors * module.exports.rooms} rooms.`);

    module.exports.lineSeparator();

};

module.exports.title = () => {
    console.clear();
    console.log('\n');

    //https://patorjk.com/software/taag/#p=display&h=1&f=ANSI%20Shadow&t=Hotel%20Lights%20Color
    console.log('    ██╗  ██╗ ██████╗ ████████╗███████╗██╗         ██╗     ██╗ ██████╗ ██╗  ██╗████████╗███████╗     ██████╗ ██████╗ ██╗      ██████╗ ██████╗ ');
    console.log('    ██║  ██║██╔═══██╗╚══██╔══╝██╔════╝██║         ██║     ██║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝    ██╔════╝██╔═══██╗██║     ██╔═══██╗██╔══██╗');
    console.log('    ███████║██║   ██║   ██║   █████╗  ██║         ██║     ██║██║  ███╗███████║   ██║   ███████╗    ██║     ██║   ██║██║     ██║   ██║██████╔╝');
    console.log('    ██╔══██║██║   ██║   ██║   ██╔══╝  ██║         ██║     ██║██║   ██║██╔══██║   ██║   ╚════██║    ██║     ██║   ██║██║     ██║   ██║██╔══██╗');
    console.log('    ██║  ██║╚██████╔╝   ██║   ███████╗███████╗    ███████╗██║╚██████╔╝██║  ██║   ██║   ███████║    ╚██████╗╚██████╔╝███████╗╚██████╔╝██║  ██║');
    console.log('    ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝    ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝     ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝');

};

module.exports.indentation = () => {
    return '    ';
}

module.exports.dataDir = () => {
    const dataDir = path.join(__dirname, '.data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    return dataDir;
};


module.exports.dataFile = (filename) => {
    return path.join(module.exports.dataDir(), filename);
};

module.exports.readDataJSON = (filename) => {
    return JSON.parse(module.exports.readData(filename));
};

module.exports.readData = (filename) => {
    return fs.readFileSync(module.exports.dataFile(filename), 'utf8');
};

module.exports.writeData = (filename, data) => {
    return fs.writeFileSync(module.exports.dataFile(filename), JSON.stringify(data), 'utf8',);
};

module.exports.dataExists = (filename) => {
    try {
        fs.statSync(module.exports.dataFile(filename));
        return true;
    } catch (err) {
        return false;
    }
};

module.exports.getAlarms = () => {
    const dataFile = 'alarms.json';

    if (false === module.exports.dataExists(dataFile)) {

        const alarms = [];
        let alarmNumber = 100000;
        const classification = Object.values(WDXSchema.WDX.Schema.Model.Alarm.AlarmClassification);
        const types = Object.values(WDXSchema.WDX.Schema.Model.Alarm.AlarmType);

        for (let floor = 1; floor <= module.exports.floors; floor++) {
            for (let room = 1; room <= module.exports.rooms; room++) {

                for (let classificationId = 0; classificationId < classification.length; classificationId++) {
                    for (let typeId = 0; typeId < types.length; typeId++) {

                        // No Empty
                        const alarm1 = new WDXSchema.WDX.Schema.Model.Alarm.Alarm();
                        alarm1.classification = classification[classificationId];
                        alarm1.type = types[typeId];
                        alarm1.name = `Example - Hotel light ${alarm1.classification} - ${alarm1.type} floor: ${floor} room: ${room} Condition: no-empty`;
                        alarm1.code = ++alarmNumber;
                        alarm1.enabled = true;

                        const condition1 = new WDXSchema.WDX.Schema.Model.Alarm.AlarmCondition();
                        condition1.path = `Virtual.hotel-light-floor-${floor}-room-${room}.color`;
                        condition1.expression = WDXSchema.WDX.Schema.Model.Alarm.AlarmConditionExpression.IS_NOT_EMPTY;

                        alarm1.conditions = [condition1];
                        alarms.push(alarm1);

                        // Empty
                        const alarm2 = new WDXSchema.WDX.Schema.Model.Alarm.Alarm();
                        alarm2.classification = classification[classificationId];
                        alarm2.type = types[typeId];
                        alarm2.name = `Example - Hotel light ${alarm2.classification} - ${alarm2.type} floor: ${floor} room: ${room} Condition: is-empty`;
                        alarm2.code = ++alarmNumber;
                        alarm2.enabled = true;

                        const condition2 = new WDXSchema.WDX.Schema.Model.Alarm.AlarmCondition();
                        condition2.path = `Virtual.hotel-light-floor-${floor}-room-${room}.color`;
                        condition2.expression = WDXSchema.WDX.Schema.Model.Alarm.AlarmConditionExpression.IS_EMPTY;

                        alarm2.conditions = [condition2];
                        alarms.push(alarm2);
                    }
                }
            }
        }

        module.exports.writeData(dataFile, alarms);

        return alarms;
    } else {
        return module.exports.readDataJSON(dataFile);
    }
};


module.exports.getTrends = () => {
    const dataFile = 'trends.json';

    if (false === module.exports.dataExists(dataFile)) {

        const trends = [];

        let trend = new WDXSchema.WDX.Schema.Model.Trend.Trend();
        trend.name = 'Hotel Lights - Current colors counts';
        trend.active = true;
        trend.legend = true;
        trend.intervalPicker = true;
        trend.exportCurrentViewButton = true;
        trend.exportFullDataButton = true;
        trend.resetButton = true;
        trend.dataPoolInterval = 1000;
        trend.xAxis.label = 'Time';
        trend.uuid = WDXUUID.v4();

        trend.yAxis[0].color = '#000000';
        trend.yAxis[0].label = 'Current count';
        trend.yAxis[0].name = 'current-color-count';
        trend.yAxis[0].min = 0;
        trend.yAxis[0].max = module.exports.roomCount();
        trend.yAxis[0].visible = true;
        trend.yAxis[0].uuid = WDXUUID.v4();
        trend.dataSet = [];

        for (color of module.exports.colors) {
            const dataSet = new WDXSchema.WDX.Schema.Model.Trend.DataSet();
            dataSet.color = `#${color}`;
            dataSet.label = dataSet.color;
            dataSet.name = dataSet.color;
            dataSet.visible = true;
            dataSet.enabled = true;
            dataSet.yAxis = trend.yAxis[0].uuid;
            dataSet.uuid = WDXUUID.v4();
            dataSet.dataSchemaPath = `Virtual.stats.current.${color}`;
            trend.dataSet.push(dataSet);
        }

        trends.push(trend);

        let trendTotal = new WDXSchema.WDX.Schema.Model.Trend.Trend();
        trendTotal.name = 'Hotel Lights - Total colors counts';
        trendTotal.active = true;
        trendTotal.legend = true;
        trendTotal.intervalPicker = true;
        trendTotal.exportCurrentViewButton = true;
        trendTotal.exportFullDataButton = true;
        trendTotal.resetButton = true;
        trendTotal.dataPoolInterval = 1000;
        trendTotal.xAxis.label = 'Time';
        trendTotal.uuid = WDXUUID.v4();

        trendTotal.yAxis[0].color = '#000000';
        trendTotal.yAxis[0].label = 'Total count';
        trendTotal.yAxis[0].name = 'total-color-count';
        trendTotal.yAxis[0].min = 0;
        trendTotal.yAxis[0].visible = true;
        trendTotal.yAxis[0].uuid = WDXUUID.v4();
        trendTotal.dataSet = [];

        for (color of module.exports.colors) {
            const dataSet = new WDXSchema.WDX.Schema.Model.Trend.DataSet();
            dataSet.color = `#${color}`;
            dataSet.label = dataSet.color;
            dataSet.name = dataSet.color;
            dataSet.visible = true;
            dataSet.yAxis = trendTotal.yAxis[0].uuid;
            dataSet.uuid = WDXUUID.v4();
            dataSet.dataSchemaPath = `Virtual.stats.total.${color}`;
            trendTotal.dataSet.push(dataSet);
        }

        trends.push(trendTotal);

        module.exports.writeData(dataFile, trends);

        return trends;
    } else {
        return module.exports.readDataJSON(dataFile);
    }
};

module.exports.getTrendStatsSchema = () => {
    const dataFile = 'trend-stats-schemas.json';

    if (false === module.exports.dataExists(dataFile)) {

        const schemas = [];
        const instance = module.exports.getTrendStatsInstance();

        const current = new WDXSchema.WDX.Schema.Model.Data.DataSchema(
            `Virtual.${instance.name}.current`,
            'current',
            'current',
            [
            ],
            new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual(),
            false,
            false,
            true,
            true,
            true,
            true,
        );

        for (color of module.exports.colors) {
            current.children.push(
                new WDXSchema.WDX.Schema.Model.Data.DataSchema(
                    `Virtual.${instance.name}.current.${color}`,
                    `${color}`,
                    `${color}`,
                    undefined,
                    new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual(),
                    false,
                    true,
                    true,
                    false,
                    true,
                    true,
                ),)
        }

        schemas.push(current);

        const total = new WDXSchema.WDX.Schema.Model.Data.DataSchema(
            `Virtual.${instance.name}.total`,
            'total',
            'total',
            [
            ],
            new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual(),
            false,
            false,
            true,
            true,
            true,
            true,
        );

        for (color of module.exports.colors) {
            total.children.push(
                new WDXSchema.WDX.Schema.Model.Data.DataSchema(
                    `Virtual.${instance.name}.total.${color}`,
                    `${color}`,
                    `${color}`,
                    undefined,
                    new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual(),
                    false,
                    true,
                    true,
                    false,
                    true,
                    true,
                ),);
        }

        schemas.push(total);

        module.exports.writeData(dataFile, schemas);

        return schemas;
    } else {
        return module.exports.readDataJSON(dataFile);
    }
};

module.exports.getTrendStatsInstance = () => {
    const dataFile = 'trend-stats-instance.json';

    if (false === module.exports.dataExists(dataFile)) {

        const uuid = WDXUUID.v4();
        const name = `stats`;
        const instance = new WDXSchema.WDX.Schema.Model.Instance.DataAdapter.VirtualDataAdapterInstance(
            uuid,
            name,
        );
        module.exports.writeData(dataFile, instance);

        return instance;
    } else {
        return module.exports.readDataJSON(dataFile);
    }
};

module.exports.getInstances = () => {
    const dataFile = 'instances.json';

    if (false === module.exports.dataExists(dataFile)) {

        const instances = [];

        for (let floor = 1; floor <= module.exports.floors; floor++) {
            for (let room = 1; room <= module.exports.rooms; room++) {
                const uuid = WDXUUID.v4();
                const name = `hotel-light-floor-${floor}-room-${room}`;
                const instance = new WDXSchema.WDX.Schema.Model.Instance.DataAdapter.VirtualDataAdapterInstance(
                    uuid,
                    name,
                );

                instances.push(instance);
            }
        }

        module.exports.writeData(dataFile, instances);

        return instances;
    } else {
        return module.exports.readDataJSON(dataFile);
    }
};


module.exports.getDataSchemas = () => {
    const dataFile = 'data-schemas.json';

    if (false === module.exports.dataExists(dataFile)) {

        const schemas = [];

        for (let floor = 1; floor <= module.exports.floors; floor++) {
            for (let room = 1; room <= module.exports.rooms; room++) {

                const name = `hotel-light-floor-${floor}-room-${room}`;

                schemas.push(new WDXSchema.WDX.Schema.Model.Data.DataSchema(
                    `Virtual.${name}.color`,
                    'color',
                    'color',
                    undefined,
                    new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual(),
                    false,
                    true,
                    true,
                    false,
                    true,
                    true,
                ));
            }
        }

        module.exports.writeData(dataFile, schemas);

        return schemas;
    } else {
        return module.exports.readDataJSON(dataFile);
    }
};

