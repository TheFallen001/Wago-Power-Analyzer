// VirtualDeviceService.js
// Handles all logic related to Virtual device instances (path: Virtual)

const { Data, Instance } = require("../utils");
const { MetaData } = Data;
const { DataSchema } = Data;
const { MetaDataVirtualAdapter, MetaDataVirtual } = MetaData;
const WDXSchema = require("@wago/wdx-schema");
const { getSchema } = require("../server");

const lastDataBroadcastTime = {};
const DATA_BROADCAST_INTERVAL = 5000;
let latestSchemaDevices = [];

class VirtualDeviceService {
  constructor() {
    this.devices = [];
  }

  // Example: Add a Virtual device
  addDevice(device, ws, client, broadcast) {
    // Add device to local array
    this.devices.push(device);
    // Create Virtual instance and schema in backend
    const instance = Instance.DataAdapter.VirtualDataAdapterInstance();
    //client.Instance.DataAdapter.VirtualDataAdapterInstance ?
    // new WDXSchema.WDX.Schema.Model.Instance.DataAdapter.VirtualDataAdapterInstance();
    // : { name: device.name, type: "Virtual" };
    instance.name = device.name;
    instance.type = "Virtual";
    console.log("Instance: ", JSON.stringify(instance));
    client.instanceService.save(instance).subscribe({
      next: (result) => {
        if (result && result.uuid) {
          client.instanceService.start(result.uuid).subscribe({
            next: () => {
              const children = [
                { key: "curr", default: 0 },
                { key: "volt", default: 0 },
                { key: "power", default: 0 },
                { key: "energy", default: 0 },
                { key: "addr1", default: 1 },
                { key: "baud1", default: 1200 },
                { key: "baud2", default: 1200 },
                { key: "check1", default: 0 },
                { key: "check2", default: 0 },
                { key: "stopBit1", default: 1 },
                { key: "stopBit2", default: 1 },
                { key: "lat", default: device.latitude },
                { key: "lng", default: device.longitude },
              ];

              children.forEach((child) => {
                const schema = new Data.DataSchema();
                schema.path = `Virtual.${instance.name}.${child.key}`;
                schema.relativePath = child.key;
                schema.readonly = false;
                schema.subscribeable = true;
                schema.expandable = false;
                schema.extendable = false;
                schema.editable = true;
                schema.removable = true;
                schema.refreshable = false;
                schema.metadata =
                  new WDXSchema.WDX.Schema.Model.Data.MetaData.MetaDataVirtual();

                client.dataService.setSchema(schema).subscribe({
                  next: (schema) => {
                    client.dataService
                      .setValue(
                        schema.path,
                        children.find(
                          (child) => child.key === schema.relativePath
                        ).default
                      )
                      .subscribe({
                        next: (response) => {
                          console.log(
                            "Response: ",
                            JSON.stringify(response, null, 2)
                          );
                        },
                        error: (error) => {
                          console.log("Error message: ", error.code);
                          console.log(
                            "Error encountered when setting values: ",
                            error.message
                          );
                        },
                        complete: async () => {
                          console.log(
                            "Default values have been set successfully"
                          );
                          const result = getSchema({ path: "Virtual" }, client);
                          ws.send(
                            JSON.stringify({
                              type: "newInstanceAdded"
                            })
                          )
                        },
                      });

                    // console.log("Schema: ", JSON.stringify(schema, null, 2))
                  },
                  error: (err) => {
                    console.error(
                      `Failed to set schema for Virtual instance ${instance.name}:`,
                      err
                    );
                  },
                });

                // ws.send(
                //   JSON.stringify({
                //       type:
                //   })
                // )
              });
            },
            error: (err) => {
              console.error(
                "Failed to start Virtual instance after save:",
                err
              );
            },
          });
        }
      },
      complete: (result) => {
        console.log("On Complete (Virtual): ", result);
      },
      error: (result) => {
        console.log("The error encountered (Virtual): ", result);
        console.log("Instance used (Virtual): ", instance);
      },
    });
  }

  // Example: Update a Virtual device
  updateDevice(id, update) {
    // ... logic to update a Virtual device ...
    const idx = this.devices.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.devices[idx] = { ...this.devices[idx], ...update };
    }
  }

  // Example: Get all Virtual devices
  getDevices() {
    return this.devices;
  }

  updateDeviceAddress(deviceName, location, client, ws, broadcast) {
    console.log("Updating Address was called...");
    let data = [
      { path: `Virtual.${deviceName}.lat`, value: location.latitude },
      { path: `Virtual.${deviceName}.lng`, value: location.longitude },
    ];

    data.forEach((datum) => {
      console.log(`Updating ${datum.path}...`);
      client.dataService.setValue(datum.path, datum.value).subscribe({
        next: (response) => {
          console.log("Response");
          console.log(JSON.stringify(response, null, 2));
        },
        error: async (error) => {
          console.error("Error Code: " + error.code);
          console.log("Error Message " + error.message);
        },
        complete: async () => {
          broadcast({ type: "schema", devices: latestSchemaDevices });
        },
      });
    });
  }
  setConfig(message, ws, client, broadcast) {
    Object.entries(message.config).forEach(([key, value]) => {
      let wdxKey = key;
      if (key === "addr1") wdxKey = "addr1";
      else if (key === "baud1") wdxKey = "baud1";
      else if (key === "check1") wdxKey = "check1";
      else if (key === "stopBit1") wdxKey = "stopBit1";
      else if (key === "baud2") wdxKey = "baud2";
      else if (key === "check2") wdxKey = "check2";
      else if (key === "stopBit2") wdxKey = "stopBit2";
      let valuePath;
      if (key === "volt" || key === "curr") {
        valuePath = message.path;
      } else {
        valuePath = `${message.path}.${wdxKey}`;
      }
      client.dataService.setValue(valuePath, value).subscribe({
        next: (result) => {
          ws.send(
            JSON.stringify({
              type: "configUpdated",
              path: valuePath,
              config: { [wdxKey]: value },
            })
          );
          let shouldBroadcast = true;
          if (wdxKey === "volt" || wdxKey === "curr") {
            const deviceKey = `${valuePath}`;
            const now = Date.now();
            if (
              lastDataBroadcastTime[deviceKey] &&
              now - lastDataBroadcastTime[deviceKey] < DATA_BROADCAST_INTERVAL
            ) {
              shouldBroadcast = false;
            } else {
              lastDataBroadcastTime[deviceKey] = now;
            }
          }
          if (shouldBroadcast) {
            broadcast({
              type: "data",
              path: valuePath,
              value: { [wdxKey]: value },
            });
          }
          if (wdxKey !== "volt" && wdxKey !== "curr") {
            client.dataService.getSchema("Virtual", 1).subscribe({
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
                          config: {
                            addr1:
                              data?.value?.addr1 ?? data?.value?.Addr1 ?? 0,
                            baud1:
                              data?.value?.baud1 ?? data?.value?.Baud1 ?? 0,
                            check1:
                              data?.value?.check1 ??
                              data?.value?.["Check Digit 1"] ??
                              0,
                            stopBit1:
                              data?.value?.stopBit1 ??
                              data?.value?.["Stop Bit 1"] ??
                              0,
                            baud2:
                              data?.value?.baud2 ?? data?.value?.Baud2 ?? 0,
                            check2:
                              data?.value?.check2 ??
                              data?.value?.["Check Digit 2"] ??
                              0,
                            stopBit2:
                              data?.value?.stopBit2 ??
                              data?.value?.["Stop Bit 2"] ??
                              0,
                          },
                          path: child.path,
                        });
                      },
                      error: () => {
                        const deviceName =
                          child.path.split(".").pop() || child.path;
                        resolve({
                          name: deviceName,
                          config: {
                            addr1: 0,
                            baud1: 0,
                            check1: 0,
                            stopBit1: 0,
                            baud2: 0,
                            check2: 0,
                            stopBit2: 0,
                          },
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
                  "[WDX getSchema ERROR after setValue] (Virtual)",
                  err
                );
              },
            });
          }
        },
        error: (err) => {
          console.error("[WDX setValue ERROR]", {
            path: valuePath,
            key: wdxKey,
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

  handleMessage(message, ws, client, broadcast) {
    console.log(
      `DeviceName received: ${JSON.stringify(message)}, ${message.path}`
    );
    if (
      message.type === "setConfig" &&
      message.path &&
      message.config &&
      message.path.startsWith("Virtual.")
    ) {
      this.setConfig(message, ws, client, broadcast);
    } else if (
      message.type === "addDevice" &&
      message.device &&
      message.device.deviceType === "Virtual"
    ) {
      this.addDevice(message.device, ws, client, broadcast);
    } else if (
      message.type === "updateAddress" &&
      message.path &&
      message.deviceName
    ) {
      this.updateDeviceAddress(
        message.deviceName,
        message.location,
        client,
        ws,
        broadcast
      );
    }
  }
}

module.exports = new VirtualDeviceService();
