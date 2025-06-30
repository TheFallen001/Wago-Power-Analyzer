// ModbusDeviceService.js
// Handles all logic related to Modbus device instances (path: Modbus)
// This is a template to be filled with Modbus-specific logic and variables

const { Data, Instance } = require("../utils");
const { MetaData } = Data;
const { DataSchema } = Data;
const { MetaDataVirtualAdapter, MetaDataVirtual } = MetaData; // TODO: Replace with Modbus-specific metadata if available
const WDXSchema = require("@wago/wdx-schema");
const { DataSourceOptions } = require("../utils/Instance");

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

  addDevice(client) {
    if (
      client &&
      client.instanceService &&
      typeof client.instanceService.save === "function"
    ) {
      // TODO: Replace with Modbus-specific metadata if available
      // const instance =
      //   new WDXSchema.WDX.Schema.Model.Instance.DataAdapter.MODBUSDataAdapterInstance();
      const instance = Instance.DataAdapter.MODBUSDataAdapterInstance();
      

      
        console.log("instance: ", instance)
      client.instanceService.save(instance).subscribe({
        next: (response) => {
          console.log("Response");
          console.log(JSON.stringify(response, null, 2));
        },

        error: async (error) => {
          console.error("Error Code: " + error.code);
          console.error("Error Message: " + error.message);

          console.log("Disconnecting");
          await client.disconnect();
          console.log("Disconnected successfully");
        },

        complete: async () => {
          console.log("Completed");
          console.log("Disconnecting");
          await c.disconnect();
          console.log("Disconnected successfully");
        },
      });
    } else {
      console.error("InstanceService not available or save method not found");
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

  handleMessage(message, ws, client, broadcast) {
    if (
      message.type === "setConfig" &&
      message.path &&
      message.config &&
      message.path.startsWith("Modbus.")
    ) {
      this.setConfig(message, ws, client, broadcast);
    } else if (
      message.type === "addDevice"
     
    ) {
      this.addDevice(client);
    }
  }
}

module.exports = new ModbusDeviceService();
