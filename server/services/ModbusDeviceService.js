// ModbusDeviceService.js
// Handles all logic related to Modbus device instances (path: Modbus)
// This is a template to be filled with Modbus-specific logic and variables

const { Data, Instance } = require("../utils");
const { MetaData } = Data;
const { DataSchema } = Data;
const { MetaDataVirtualAdapter, MetaDataVirtual } = MetaData; // TODO: Replace with Modbus-specific metadata if available
const WDXSchema = require("@wago/wdx-schema-base");
const { DataSourceOptions } = require("../utils/Instance");
const { firstValueFrom } = require("rxjs");

const lastDataBroadcastTime = {};
const DATA_BROADCAST_INTERVAL = 5000;
let latestSchemaDevices = [];

class ModbusDeviceService {
  constructor() {
    this.devices = [];
  }

  setConfig(message, ws, client, broadcast) {
    Object.entries(message.config).forEach(([key, value]) => {
      let valuePath = `${message.path}.${key}`;
      client.dataService.setValue(valuePath, value).subscribe({
        next: (result) => {
          ws.send(
            JSON.stringify({
              type: "configUpdated",
              path: valuePath,
              config: { [key]: value },
            })
          );
          let shouldBroadcast = true;
          // No volt/curr throttling for Modbus, but you can add if needed
          if (shouldBroadcast) {
            broadcast({
              type: "data",
              path: valuePath,
              value: { [key]: value },
            });
          }
          client.dataService.getSchema("Modbus", 1).subscribe({
            next: (schema) => {
              const children = schema.children || [];
              const devicePromises = children.map((child) => {
                return new Promise((resolve) => {
                  client.dataService.register(child.path).subscribe({
                    next: (data) => {
                      const deviceName =
                        child.path.split(".").pop() || child.path;
                      resolve({
                        name: deviceName,
                        config: data?.value || {},
                        path: child.path,
                      });
                    },
                    error: () => {
                      const deviceName =
                        child.path.split(".").pop() || child.path;
                      resolve({
                        name: deviceName,
                        config: {},
                        path: child.path,
                      });
                    },
                  });
                });
              });
              Promise.all(devicePromises).then((devices) => {
                latestSchemaDevices = devices.map(({ name, config }) => ({
                  name,
                  config,
                }));
                broadcast({
                  type: "schema",
                  devices: latestSchemaDevices,
                });
              });
            },
            error: (err) => {
              console.error(
                "[WDX getSchema ERROR after setValue] (Modbus)",
                err
              );
            },
          });
        },
        error: (err) => {
          console.error("[WDX setValue ERROR] (Modbus)", {
            path: valuePath,
            key,
            value,
            error: err && err.message ? err.message : err,
          });
          ws.send(
            JSON.stringify({
              type: "configUpdateError",
              path: valuePath,
              error: err && err.message ? err.message : err,
            })
          );
        },
      });
    });
  }

  async addDevice(client, device, modbusOptions) {
    if (
      client &&
      client.instanceService &&
      typeof client.instanceService.save === "function"
    ) {
      // TODO: Replace with Modbus-specific metadata if available
      return new Promise((resolve, reject) => {
        try {
          const inst = initInstance(
            device.name,
            modbusOptions.hostAddress,
            modbusOptions.port,
            modbusOptions.clientID
          );
          // const instance = Instance.DataAdapter.MODBUSDataAdapterInstance();

          // console.log("Detail running...", inst.uuid);

          const information = client.instanceService
            .detail(inst.uuid)
            .subscribe({
              next: async (response) => {
                // console.log(response);

                await client.instanceService.start(inst.uuid).toPromise();
                resolve();
              },
              error: async (error) => {
                // console.log("Error was called")
                // console.error(error);
                await client.instanceService.save(inst).toPromise();

                await client.instanceService.start(inst.uuid).toPromise();
                resolve();
              },
            });

          console.log("Done running...");
          console.log("Information: ", information);
        } catch (e) {
          reject(e);
        }
      });
    }
  }

  updateDevice(id, update) {
    const idx = this.devices.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.devices[idx] = { ...this.devices[idx], ...update };
    }
  }
  getDevices() {
    return this.devices;
  }

  async handleMessage(message, ws, client, broadcast) {
    if (
      message.type === "setConfig" &&
      message.path &&
      message.config &&
      message.path.startsWith("Modbus.")
    ) {
      this.setConfig(message, ws, client, broadcast);
    } else if (
      message.type === "addDevice" &&
      message.device.deviceType === "MODBUS"
    ) {
      console.log(JSON.stringify(message, null, 2));
      await this.addDevice(client, message.device, message.modbusInfo);
      broadcast();
    }
  }
}

const initInstance = (
  name = "test",
  ipaddress = "192.168.2.90",
  port = 502,
  clientID = 3
) => {
  //console.debug('Benchmark.initInstance', i, uuid);

  const instance =
    new WDXSchema.WDX.Schema.Model.Instance.DataAdapter.MODBUSDataAdapterInstance();
  instance.name = name;
  instance.enabled = true;
  instance.ipcType = "tcp";

  instance.tcpOptions = new WDXSchema.WDX.Schema.Model.Instance.TCPOptions();
  instance.tcpOptions.serverOpts =
    new WDXSchema.WDX.Schema.Model.Instance.TCPOptionsServer();
  instance.tcpOptions.listenOpts =
    new WDXSchema.WDX.Schema.Model.Instance.TCPOptionsListen();

  instance.udpOptions = new WDXSchema.WDX.Schema.Model.Instance.UDPOptions();

  instance.dataSourceOptions =
    new WDXSchema.WDX.Schema.Model.Instance.DataSourceOptions();
  instance.dataSourceOptions.name = "default";

  instance.logOptions = new WDXSchema.WDX.Schema.Model.Instance.LogOptions();
  instance.logOptions.mergeLog = true;
  instance.logOptions.level = "debug";
  instance.logOptions.mergeLogFile = `./logs/${instance.uuid}.log`;

  instance.executionOptions =
    new WDXSchema.WDX.Schema.Model.Instance.ExecutionOptions();
  instance.executionOptions.mode = "worker";
  instance.executionOptions.script = "./node_modules/.bin/wdx-virtual";

  instance.modbusOptions =
    new WDXSchema.WDX.Schema.Model.Instance.DataAdapter.MODBUSOptions();
  instance.modbusOptions.host = ipaddress;
  instance.modbusOptions.port = port;
  instance.modbusOptions.clientId = clientID;

  // instance.modbusOptions.clientID
  return instance;
};

module.exports = new ModbusDeviceService();

// DOcker Command
// docker run -d -p 7081:80 -p 7481:443 --name wdx-runtime --restart unless-stopped   -v C:\Users\ustaz\Documents\WAGO\wdx-logs\data:/opt/elrest/edesign/wdx/data -v C:\Users\ustaz\Documents\WAGO\wdx-logs\config:/opt/elrest/edesign/wdx/config -v C:\Users\ustaz\Documents\WAGO\wdx-logs\js-storage:/opt/elrest/edesign/wdx/storage wdx-runtime:4.0.1.107-X86_64-alpine
