const { Data, Instance } = require("../utils");
const { MetaData } = Data;
const { DataSchema } = Data;
const { MetaDataVirtualAdapter, MetaDataVirtual } = MetaData; // TODO: Replace with Modbus-specific metadata
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
    const updates = [];
    Object.entries(message.config).forEach(([key, value]) => {
      let valuePath = `${message.path}.${key}`;
      console.log(`Attempting to set ${valuePath} to ${value}`);
      const updatePromise = client.dataService
        .setValue(valuePath, value)
        .toPromise()
        .then((result) => {
          console.log(`Result for ${valuePath}:`, result);
          ws.send(
            JSON.stringify({
              type: "configUpdated",
              path: valuePath,
              config: { [key]: value },
            })
          );
          return { path: valuePath, value: { [key]: value }, success: true };
        })
        .catch((err) => {
          console.error(`[WDX setValue ERROR] for ${valuePath}:`, {
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
          return { path: valuePath, value: { [key]: value }, success: false };
        });
      updates.push(updatePromise);
    });

    Promise.all(updates).then((results) => {
      results.forEach((result) => {
        if (result.success) {
          broadcast({
            type: "data",
            path: result.path,
            value: result.value,
          });
        }
      });

      // Update schema regardless of individual successes
      client.dataService.getSchema("Modbus", 1).subscribe({
        next: (schema) => {
          const children = schema.children || [];
          const devicePromises = children.map(
            (child) =>
              new Promise((resolve) => {
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
              })
          );
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
          console.error("[WDX getSchema ERROR after setValue] (Modbus)", err);
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
      return new Promise((resolve, reject) => {
        try {
          const inst = initInstance(
            device.name,
            modbusOptions.hostAddress,
            modbusOptions.port,
            modbusOptions.clientID
          );
          const information = client.instanceService
            .detail(inst.uuid)
            .subscribe({
              next: async (response) => {
                await client.instanceService.start(inst.uuid).toPromise();
                resolve();
              },
              error: async (error) => {
                await client.instanceService.save(inst).toPromise();
                await client.instanceService.start(inst.uuid).toPromise();
                resolve();
              },
            });
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

  async handleCsv(client, device, schemas,ws) {
    schemas.shift();
    schemas.forEach((child) => {
      let parent = device.name.trim().split(" ").pop();
      let schemaPath = `MODBUS.${parent}.${child[1]}`;
      const schema = new WDXSchema.WDX.Schema.Model.Data.DataSchema();
      schema.path = schemaPath;
      schema.relativePath = child[1];
      schema.description = child[2];
      schema.readonly = !child[4]
        .split(this.ACCESS_SEPARATOR)
        .includes(
          WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSAccess.WRITE
        );
      schema.subscribeable = true;
      schema.editable = true;
      schema.extendable = false;
      schema.expandable = false;
      schema.refreshable = false;
      schema.removable = true;
      schema.metadata = this.getSchemaMetaData(child);

      client.dataService.setSchema(schema).subscribe({
        next: (result) => {
          console.log("Result after setting schema: ",JSON.stringify(result,null,2));
          

        },
        error: async (error) => {
          console.error("Error encountered while setting schema: ", error);

        },
        complete: async () => {
          console.log("Schema set completed!")
        }
      })
    });
  }

  getSchemaMetaData(child) {
    const schemaMetadata =
      new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataMODBUS();
    schemaMetadata.MODBUSAddressFrom = Number(child[0]);
    schemaMetadata.MODBUSAccess = child[4].split("/");
    schemaMetadata.MODBUSReadTransformation = child[5];
    schemaMetadata.MODBUSWriteTransformation = child[6];

    if (
      Object.values(
        WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
      ).includes(child[3])
    ) {
      schemaMetadata.MODBUSType = child[3];
      switch (schemaMetadata.MODBUSType) {
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT32_BE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT32_BE_RE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT32_LE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT32_LE_RE:
          schemaMetadata.MODBUSAddressLength = 2;
          break;
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT64_BE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT64_BE_RE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT64_LE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .FLOAT64_LE_RE:
          schemaMetadata.MODBUSAddressLength = 4;
          break;

        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .INT16_BE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .INT16_LE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .UINT16_BE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .UINT16_BE:
          schemaMetadata.MODBUSAddressLength = 1;
          break;

        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .INT32_BE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .INT32_LE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .UINT32_BE:
        case WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
          .UINT32_BE:
          schemaMetadata.MODBUSAddressLength = 2;
          break;
      }
    } else {
      if (
        child[3].includes(
          WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType.STRING_LE
        ) ||
        child[3].includes(
          WDXSchema.WDX.Schema.Model.Data.MetaData.MetadataMODBUSType
            .STRING_LE_RE
        )
      ) {
        const regexp = /\((\d)+\)/g;
        const match = child[3].match(regexp);
        if (null !== match && 0 < match?.length) {
          schemaMetadata.MODBUSAddressLength = Number(
            match[0].replace("(", "").replace(")", "")
          );
          schemaMetadata.MODBUSType = child[3].replace(match[0], "");
        } else {
          throw `Wrong data type '${child[3]}'`;
        }
      }
    }
    return schemaMetadata;
  }

  async handleMessage(message, ws, client, broadcast) {
    console.log("ModbusDeviceService handling message:", message);
    if (!message || !message.type) {
      console.warn("Invalid message received in ModbusDeviceService:", message);
      return;
    }
    if (
      message.type === "setConfig" &&
      message.path &&
      message.config &&
      message.path.startsWith("MODBUS.")
    ) {
      console.log(`Setting config for ${message.path}:`, message.config);
      this.setConfig(message, ws, client, broadcast);
    } else if (
      message.type === "addDevice" &&
      message.device.deviceType === "MODBUS"
    ) {
      console.log(JSON.stringify(message, null, 2));
      await this.addDevice(client, message.device, message.modbusInfo);
      broadcast();
    } else if (message.type === "csvUpload") {
      console.log("Upload CSV was called");
      await this.handleCsv(client, message.device, message.schemas,ws);
    } else {
      console.warn(
        "Unhandled message type or path:",
        message.type,
        message.path
      );
    }
  }
}

const initInstance = (
  name = "test",
  ipaddress = "192.168.2.90",
  port = 502,
  clientID = 3
) => {
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
  return instance;
};

module.exports = new ModbusDeviceService();
