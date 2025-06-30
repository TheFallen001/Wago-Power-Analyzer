/**
* Elrest - WDX - WS - Client - JS - Example - Data Set Value
*
* Sets Data Value for given path from WDX with WS client.
*
* @copyright 2024 Elrest AutomationsSysteme GMBH
*/
 
const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXSchema = require('@wago/wdx-schema-base');
const WDXConfiguration = require('./configuration');
//const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
 
class JsonModel {
 
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }
 
    fileExists() {
        try {
            return fs.existsSync(this.filePath);
        } catch (error) {
            console.error(`Error checking if file exists at ${this.filePath}:`, error);
            return false;
        }
    }
 
    read() {
        if (!this.fileExists()) {
            console.error(`File not found at ${this.filePath}`);
            return null;
        }
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading file at ${this.filePath}:`, error);
            return null;
        }
    }
 
    write(data) {
        try {
            const jsonData = JSON.stringify(data, null, 2); // Format with 2-space indentation
            fs.writeFileSync(this.filePath, jsonData, 'utf8');
            console.log(`Data successfully written to ${this.filePath}`);
        } catch (error) {
            console.error(`Error writing to file at ${this.filePath}:`, error);
        }
    }
 
    update(updater) {
        const data = this.read();
        if (data) {
            const updatedData = updater(data);
            this.write(updatedData);
        }
    }
}
 
class DurationTracker {
 
    constructor() {
        this.durations = {};
    }
 
    start(name) {
        if (!name) {
            console.error('Name is required');
            return;
        }
        if (this.durations[name]) {
            console.warn(`Timer for "${name}" is already running`);
        } else {
            this.durations[name] = { start: Date.now() };
        }
    }
 
    stop(name) {
        if (!name) {
            console.error('Name is required');
            return;
        }
        if (!this.durations[name]) {
            console.error(`No timer found for "${name}"`);
        } else {
            const endTime = Date.now();
            const duration = endTime - this.durations[name].start;
            console.log(`Duration for "${name}": ${duration} milliseconds`);
            delete this.durations[name];
        }
    }
}
 
const tracker = new DurationTracker();
 
const interval = (duration, fn) => {
    const _this = this;
    this.baseline = undefined;
 
    this.run = function () {
        if (_this.baseline === undefined) {
            _this.baseline = new Date().getTime()
        }
        fn()
        var end = new Date().getTime()
        _this.baseline += duration
 
        var nextTick = duration - (end - _this.baseline)
        if (nextTick < 0) {
            nextTick = 0
        }
 
        _this.timer = setTimeout(function () {
            _this.run(end)
        }, nextTick)
    }
 
    this.stop = function () {
        clearTimeout(_this.timer)
    }
}
 
const initInstances = async () => {
 
    console.debug('Benchmark.initInstances', WDXConfiguration.configuration.instaceCount);
    const tracker = new DurationTracker();
    tracker.start('Benchmark.initInstances');
 
    let instances = [];
    const model = new JsonModel('./instances.json');
 
    if (model.fileExists()) {
        console.debug('Benchmark.initInstances', 'instances.json already exists');
        instances = model.read();
    } else {
        console.debug('Benchmark.initInstances.creating');
        for (let i = 1; i <= WDXConfiguration.configuration.instaceCount; i++) {
            instances.push(await initInstance(i));
        }
 
        model.write(instances);
    }
 
    tracker.stop('Benchmark.initInstances');
    return instances;
}
 
const persistSchemas = async (schemas, client) => {
    tracker.start('Benchmark.persistSchemas');
 
    const promises = [];
 
    for (let i = 0; i < schemas.length; i++) {
        try {
            //promises.push();
            await persistSchema(schemas[i], client);
        } catch (error) {
            //await client.dataService.deleteSchema(schemas[i].path).toPromise();
            //await persistSchema(schemas[i], client);
            console.error(error);
        }
    }
 
    tracker.stop('Benchmark.persistSchemas');
}
 
const persistSchema = async (schema, client) => {
    try {
        await client.dataService.getSchema(schema.path, 1).toPromise();
    } catch (error) {
        console.error(`Schema not exists ${schema.path}`);
        await client.dataService.setSchema(schema).toPromise();
    }
}
 
const persistInstances = async (instances, client) => {
    tracker.start('Benchmark.persistInstances');
 
    const promises = [];
 
    for (let i = 0; i < instances.length; i++) {
        await persistInstance(instances[i], client);
    }
 
    tracker.stop('Benchmark.persistInstances');
}
 
const persistInstance = async (instance, client) => {
    try {
        const i = await client.instanceService.detail(instance.uuid).toPromise();
 
        if (i.starus !== "Online") {
            await client.instanceService.start(instance.uuid).toPromise();
        }
 
    } catch (error) {
        console.error(`Instance not exists ${instance.uuid}`);
        const i = await client.instanceService.save(instance).toPromise();
        await client.instanceService.start(instance.uuid).toPromise();
    }
}
 
const startInstance = async (instance, client) => {
    client.instanceService.start(instance.uuid).toPromise();
}
 
const initInstance = async (i) => {
    //console.debug('Benchmark.initInstance', i, uuid);
 
    const instance = new WDXSchema.WDX.Schema.Model.Instance.DataAdapter.VirtualDataAdapterInstance();
    instance.name = `bench-${i}`;
    instance.enabled = true;
    instance.ipcType = "tcp";
 
    instance.tcpOptions = new WDXSchema.WDX.Schema.Model.Instance.TCPOptions();
    instance.tcpOptions.serverOpts = new WDXSchema.WDX.Schema.Model.Instance.TCPOptionsServer();
    instance.tcpOptions.listenOpts = new WDXSchema.WDX.Schema.Model.Instance.TCPOptionsListen();
 
    instance.udpOptions = new WDXSchema.WDX.Schema.Model.Instance.UDPOptions();
 
    instance.dataSourceOptions = new WDXSchema.WDX.Schema.Model.Instance.DataSourceOptions();
    instance.dataSourceOptions.name = 'default';
 
    instance.logOptions = new WDXSchema.WDX.Schema.Model.Instance.LogOptions();
    instance.logOptions.mergeLog = true;
    instance.logOptions.level = 'debug';
    instance.logOptions.mergeLogFile = `./logs/${instance.uuid}.log`;
 
    instance.executionOptions = new WDXSchema.WDX.Schema.Model.Instance.ExecutionOptions();
    instance.executionOptions.mode = 'worker';
    instance.executionOptions.script = './node_modules/.bin/wdx-virtual';
 
    return instance;
}
 
const initSchemas = async () => {
    console.debug('Benchmark.initSchemas', WDXConfiguration.configuration.dataCount);
    const tracker = new DurationTracker();
    tracker.start('Benchmark.initSchemas');
 
    let schemas = [];
    const model = new JsonModel('./schemas.json');
 
    if (model.fileExists()) {
        console.debug('Benchmark.initSchemas.already-exists');
        schemas = model.read();
    } else {
        console.debug('Benchmark.initSchemas.creating');
 
        for (let i = 1; i <= WDXConfiguration.configuration.instaceCount; i++) {
 
            for (let j = 1; j <= WDXConfiguration.configuration.dataCount; j++) {
                try {
                    schemas.push(await initSchema(i, j));
                } catch (error) {
 
                }
            }
        }
 
        model.write(schemas);
    }
 
    tracker.stop('Benchmark.initSchemas');
    return schemas;
}
 
const initSchema = async (instanceId, schemaId) => {
    const name = `var-${schemaId}`;
    const path = `Virtual.bench-${instanceId}.${name}`;
 
    const schema = new WDXSchema.WDX.Schema.Model.Data.DataSchema();
    schema.path = path;
    schema.relativePath = name;
    schema.readonly = false;
    schema.subscribeable = true;
    schema.expandable = false;
    schema.extendable = false;
    schema.editable = true;
    schema.removable = true;
    schema.refreshable = false;
    schema.metadata = new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual();
 
    return schema;
}
 
 
const initSchemaModbus = async (instanceId, schemaId) => {
    const name = `var-${schemaId}`;
    const path = `MODBUS.bench-${instanceId}.${name}`;
 
    const schema = new WDXSchema.WDX.Schema.Model.Data.DataSchema();
    schema.path = path;
    schema.relativePath = name;
    schema.readonly = false;
    schema.subscribeable = true;
    schema.expandable = false;
    schema.extendable = false;
    schema.editable = true;
    schema.removable = true;
    schema.refreshable = false;
    schema.metadata = new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataMODBUS();
 
    return schema;
}
 
const dataSubscriptions = [];
 
const subscribeValues = async (schemas, client) => {
 
    console.debug('Benchmark.subscribeValues',);
 
    for (let schema of schemas) {
        try {
            dataSubscriptions.push(
 
                client.dataService.register(
                    schema.path,
                ).subscribe(
                    {
                        next: (value) => {
                            valueAnalyzer(value);
                        },
                        error: (error) => {
                            console.error('Benchmark.subscribeValues.error', schema, error);
                        },
                    }
                ),
            );
        } catch (error) {
            console.error('Benchmark.subscribeValues.error', error);
        }
    }
}
 
const valueAnalyzer = (value) => {
    //console.debug('Benchmark.valueAnalyzer', value);
}
 
(async () => {
    try {
        const c = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXConfiguration.wss
        );
 
        console.log('Connecting', WDXConfiguration);
        await c.connect();
        console.log('Connected successfully');
 
        console.log('Initializing instances');
        const instances = await initInstances();// create amout instances and persists it to file to have same uuid
        await persistInstances(instances, c); // create if not exists and start
 
        console.log('Initializing schemas');
        const schemas = await initSchemas(); // create amout of schemas in each instance and persists it to file to have same uuid
        await persistSchemas(schemas, c);// create if not exists
 
        console.log('Subscribing data values');
        await subscribeValues(schemas, c);
 
    } catch (e) {
        console.error('Error: ' + JSON.stringify(e));
    }
})();
 
 