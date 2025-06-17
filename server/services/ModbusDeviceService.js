// ModbusDeviceService.js
// Handles all logic related to Modbus device instances (path: Modbus)
// This is a template to be filled with Modbus-specific logic and variables

const { Data } = require("../utils");
const { MetaData } = Data;
const { DataSchema } = Data;
const { MetaDataVirtualAdapter, MetaDataVirtual } = MetaData; // TODO: Replace with Modbus-specific metadata if available

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
                      const deviceName = child.path.split(".").pop() || child.path;
                      resolve({
                        name: deviceName,
                        config: data?.value || {},
                        path: child.path,
                      });
                    },
                    error: () => {
                      const deviceName = child.path.split(".").pop() || child.path;
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
              console.error("[WDX getSchema ERROR after setValue] (Modbus)", err);
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

  addDevice(device, ws, client, broadcast) {
    if (
      client &&
      client.instanceService &&
      typeof client.instanceService.save === "function"
    ) {
      // TODO: Replace with Modbus-specific metadata if available
      const instance = { name: device.name, type: "Modbus" };
      client.instanceService.save(instance).subscribe({
        next: (result) => {
          if (result && result.uuid) {
            client.instanceService.start(result.uuid).subscribe({
              next: () => {
                // Only include config variables for Modbus config page
                const children = [
                  { key: "Addr1", type: "number" },
                  { key: "Baud1", type: "number" },
                  { key: "Check1", type: "number" },
                  { key: "Baud2", type: "number" },
                  { key: "Check2", type: "number" },
                  { key: "645Addr", type: "number" },
                  { key: "Language", type: "number" },
                ];
                const childSchemas = children.map(({ key, type }) =>
                  new DataSchema(
                    `Modbus.${instance.name}.${key}`,
                    key,
                    key,
                    undefined,
                    new MetaDataVirtual(), // TODO: Replace with Modbus metadata
                    false,
                    true,
                    true,
                    false,
                    true,
                    false
                  )
                );
                const parentSchema = new DataSchema(
                  `Modbus.${instance.name}`,
                  instance.name,
                  instance.name,
                  childSchemas,
                  new MetaDataVirtualAdapter(), // TODO: Replace with Modbus metadata
                  false,
                  true,
                  true,
                  true,
                  true,
                  false
                );
                client.dataService.setSchema(parentSchema).subscribe({
                  next: () => {
                    client.dataService.getSchema("Modbus", 1).subscribe({
                      next: (updatedSchema) => {
                        const children = updatedSchema.children || [];
                        const devicePromises = children.map((child) => {
                          return new Promise((resolve) => {
                            client.dataService
                              .register(child.path)
                              .subscribe({
                                next: (data) => {
                                  const deviceName = child.path.split(".").pop() || child.path;
                                  resolve({
                                    name: deviceName,
                                    config: data?.value || {},
                                    path: child.path,
                                  });
                                },
                                error: () => {
                                  const deviceName = child.path.split(".").pop() || child.path;
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
                        console.error("[WDX getSchema ERROR after setSchema] (Modbus)", err);
                      },
                    });
                  },
                  error: (err) => {
                    console.error(`Failed to set schema for Modbus instance ${instance.name}:`, err);
                  },
                });
              },
              error: (err) => {
                console.error("Failed to start Modbus instance after save:", err);
              },
            });
          }
        },
        complete: (result) => {
          console.log("On Complete (Modbus): ", result);
        },
        error: (result) => {
          console.log("The error encountered (Modbus): ", result);
          console.log("Instance used (Modbus): ", instance);
        },
      });
    } else {
      console.error("InstanceService not available or save method not found");
    }
  }

  updateDevice(id, update) {
    const idx = this.devices.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.devices[idx] = { ...this.devices[idx], ...update };
    }
  }

  getDevices() {
    return this.devices;
  }

  handleMessage(message, ws, client, broadcast) {
    if (message.type === "setConfig" && message.path && message.config && message.path.startsWith("Modbus.")) {
      this.setConfig(message, ws, client, broadcast);
    } else if (message.type === "addDevice" && message.device && message.device.type === "Modbus") {
      this.addDevice(message.device, ws, client, broadcast);
    }
  }
}

module.exports = new ModbusDeviceService();
