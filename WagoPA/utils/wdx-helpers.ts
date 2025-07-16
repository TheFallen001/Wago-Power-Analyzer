//helpers to work with the server.
export type Device = {
  deviceType?: string;
  currentMax: number;
  currentMin: number;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  voltageRange: string;
  config: any;
};

export type ModbusConfig = {
  Addr1: number;
  Baud1: number;
  Check1: number;
  Baud2: number;
  Check2: number;
  "645Addr": number;
  Language: number;
  // Graph variables (read-only)
  F?: number;
  PF?: number;
  QT?: number;
  PT?: number;
  UA?: number;
  IA?: number;
};

interface AlarmEvent {
  type: "volt" | "curr";
  value: number;
  deviceName: string;
}

class WDXHelpers {
  devices: Device[] = [];
  validDevicePaths: Set<string> = new Set();
  lastSchemaDevices: { name: string; config: Device["config"] }[] = [];
  devicePathMap: { [key: string]: string } = {};
  listeners: Array<(devices: Device[]) => void> = [];
  logData: string = "";
  isInitialized = false;

  alarmListeners: Array<(alarm: AlarmEvent) => void> = [];

  notifyListeners = () => {
    this.listeners.forEach((listener) => listener(this.devices));
  };

  isSchemaChanged(newSchema: { name: string; config: Device["config"] }[]) {
    if (this.lastSchemaDevices.length !== newSchema.length) return true;
    for (let i = 0; i < newSchema.length; i++) {
      if (this.lastSchemaDevices[i].name !== newSchema[i].name) return true;
    }
    return false;
  }

  notifySchemaListeners() {
    console.log();
    this.listeners.forEach((listener) => listener(this.devices));
  }

  updateDevicesFromWDX = (
    wdxDevices: { name: string; deviceType: string; config: Device["config"] }[]
  ) => {
    
    wdxDevices.forEach((wdxDevice, index) => {
      const deviceName = wdxDevice.name;
      const fullName = `Analyzer - ${deviceName}`;
      let device = this.devices.find((d) => d.name === fullName);
      

      if (!device) {
        switch (wdxDevice.deviceType) {
          case "Virtual ": {
            device = {
              id: (index + 1).toString(),
              name: fullName,
              deviceType: wdxDevice.deviceType,
              latitude: 41.0 + index * 0.01,
              longitude: 29.0 + index * 0.01,
              address: "",
              voltageRange: "230V",
              currentMax: 2.0,
              currentMin: 0,
              config: wdxDevice.config || {
                addr1: 1,
                baud1: 9600,
                check1: 0,
                stopBit1: 0,
                baud2: 9600,
                check2: 0,
                stopBit2: 0,
                lat: 40.0001,
                lng: 28.0001,
              },
            };

            this.devices.push(device);
            break;
          }
          case "MODBUS": {
            
            device = {
              id: (index + 1).toString(),
              name: fullName,
              deviceType: wdxDevice.deviceType,
              latitude: 41.0 + index * 0.01,
              longitude: 29.0 + index * 0.01,
              address: "",
              voltageRange: "230V",
              currentMax: 2.0,
              currentMin: 0,
              config: wdxDevice.config || {
                Addr1: 0,
                Baud1: 0,
                Check1: 0,
                Baud2: 0,
                Check2: 0,
                "645Addr": 0,
                Language: 0,
                F: 0,
                PF: 0,
                QT: 0,
                PT: 0,
                UA: 0,
                IA: 0,
              },
            };
            this.devices.push(device);
            break;
          }
        }
      } else if (wdxDevice.config && Object.keys(wdxDevice.config).length > 0) {
        device.config = wdxDevice.config;
        device.deviceType = wdxDevice.deviceType;
      }
    });
  };

  updateDeviceFromWDXData = (path: string, value: any) => {
    // Extract device name from path: e.g., Virtual.Virt.volt -> Virt
    const parts = path.split(".");
    const deviceName = parts[1];
    const device = this.devices.find(
      (d) => d.name === `Analyzer - ${deviceName}`
    );
    if (device && value) {
      let hasConfigChange = false;
      const updatedConfig = { ...device.config };
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === "number") {
          // Only update config keys for configuration, but always update live values (volt, curr, power, energy)
          if (
            key === "Addr1" ||
            key === "addr1" ||
            key === "Baud1" ||
            key === "baud1" ||
            key === "Check Digit 1" ||
            key === "check1" ||
            key === "Stop Bit 1" ||
            key === "stopBit1" ||
            key === "Baud2" ||
            key === "baud2" ||
            key === "Check Digit 2" ||
            key === "check2" ||
            key === "Stop Bit 2" ||
            key === "stopBit2"
          ) {
            if (key === "Addr1" || key === "addr1") {
              if (updatedConfig.addr1 !== val) {
                updatedConfig.addr1 = val;
                hasConfigChange = true;
              }
            } else if (key === "Baud1" || key === "baud1") {
              if (updatedConfig.baud1 !== val) {
                updatedConfig.baud1 = val;
                hasConfigChange = true;
              }
            } else if (key === "Check Digit 1" || key === "check1") {
              if (updatedConfig.check1 !== val) {
                updatedConfig.check1 = val;
                hasConfigChange = true;
              }
            } else if (key === "Stop Bit 1" || key === "stopBit1") {
              if (updatedConfig.stopBit1 !== val) {
                updatedConfig.stopBit1 = val;
                hasConfigChange = true;
              }
            } else if (key === "Baud2" || key === "baud2") {
              if (updatedConfig.baud2 !== val) {
                updatedConfig.baud2 = val;
                hasConfigChange = true;
              }
            } else if (key === "Check Digit 2" || key === "check2") {
              if (updatedConfig.check2 !== val) {
                updatedConfig.check2 = val;
                hasConfigChange = true;
              }
            } else if (key === "Stop Bit 2" || key === "stopBit2") {
              if (updatedConfig.stopBit2 !== val) {
                updatedConfig.stopBit2 = val;
                hasConfigChange = true;
              }
            }
          } else if (
            key === "volt" ||
            key === "curr" ||
            key === "power" ||
            key === "energy"
          ) {
            // Always update live values for real-time display, but do not trigger config change
            if (updatedConfig[key] !== val) {
              updatedConfig[key] = val;
              // Do not set hasConfigChange = true for live values
            }
          }
        }
      });
      // Only notify listeners if config keys changed (not for live values)
      if (hasConfigChange) {
        device.config = updatedConfig;
        this.notifyListeners();
      } else if (
        "volt" in value ||
        "curr" in value ||
        "power" in value ||
        "energy" in value
      ) {
        device.config = updatedConfig;
        // Notify listeners for live value updates (real-time UI)
        this.notifyListeners();
      }
    }
  };

  subscribeToAlarms = (cb: (alarm: AlarmEvent) => void) => {
    this.alarmListeners.push(cb);
    return () => {
      const idx = this.alarmListeners.indexOf(cb);
      if (idx !== -1) this.alarmListeners.splice(idx, 1);
    };
  };

  subscribeToDeviceUpdates = (callback: (devices: Device[]) => void) => {
    this.listeners.push(callback);
    if (this.isInitialized) callback(this.devices);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index !== -1) this.listeners.splice(index, 1);
    };
  };

  setDevicePaths(device: any) {
    const deviceName = device.name;
    switch (device.deviceType) {
      case "Virtual": {
        this.validDevicePaths.add(`Virtual.${deviceName}.volt`);
        this.validDevicePaths.add(`Virtual.${deviceName}.curr`);
        this.validDevicePaths.add(`Virtual.${deviceName}.addr1`);
        this.validDevicePaths.add(`Virtual.${deviceName}.baud1`);
        this.validDevicePaths.add(`Virtual.${deviceName}.baud2`);
        this.validDevicePaths.add(`Virtual.${deviceName}.check1`);
        this.validDevicePaths.add(`Virtual.${deviceName}.check2`);
        this.validDevicePaths.add(`Virtual.${deviceName}.stopBit1`);
        this.validDevicePaths.add(`Virtual.${deviceName}.stopBit2`);
        this.devicePathMap[deviceName] = `Virtual.${deviceName}`;
        break;
      }
      case "MODBUS": {
        // Config variables
        this.validDevicePaths.add(`MODBUS.${deviceName}.Addr1`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.Baud1`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.Check1`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.Baud2`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.Check2`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.645Addr`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.Language`);
        // Graph varibles
        this.validDevicePaths.add(`MODBUS.${deviceName}.F`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.PF`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.QT`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.PT`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.UA`);
        this.validDevicePaths.add(`MODBUS.${deviceName}.IA`);
        this.devicePathMap[deviceName] = `MODBUS.${deviceName}`;
        break;
      }
    }
  }
}

export default new WDXHelpers();
export { WDXHelpers };
