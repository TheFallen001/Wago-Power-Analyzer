// VirtualDeviceStore.ts
// Contains all logic and functions related to Virtual device instances (path: Virtual)

import { Device } from "./DeviceStore";

// --- Virtual Device Path Helpers ---
let validDevicePaths: Set<string> = new Set();
let devicePathMap: { [key: string]: string } = {};

export function setVirtualDevicePaths(devices: { name: string }[]) {
  validDevicePaths = new Set();
  devicePathMap = {};
  devices.forEach((device) => {
    const deviceName = device.name;
    validDevicePaths.add(`Virtual.${deviceName}.volt`);
    validDevicePaths.add(`Virtual.${deviceName}.curr`);
    validDevicePaths.add(`Virtual.${deviceName}.addr1`);
    validDevicePaths.add(`Virtual.${deviceName}.baud1`);
    validDevicePaths.add(`Virtual.${deviceName}.baud2`);
    validDevicePaths.add(`Virtual.${deviceName}.check1`);
    validDevicePaths.add(`Virtual.${deviceName}.check2`);
    validDevicePaths.add(`Virtual.${deviceName}.stopBit1`);
    validDevicePaths.add(`Virtual.${deviceName}.stopBit2`);
    devicePathMap[deviceName] = `Virtual.${deviceName}`;
  });
}

export function getVirtualDevicePath(deviceName: string) {
  return devicePathMap[deviceName];
}

export function isVirtualDevicePath(path: string) {
  return path.startsWith("Virtual.");
}

// --- Virtual Device Simulation Ranges ---
export const VOLTAGE_RANGE = { min: 215, max: 240 };
export const CURRENT_RANGE = { min: 0, max: 2.0 };
export const VOLTAGE_ALARM_RANGE = { min: 215, max: 236 };
export const CURRENT_ALARM_RANGE = { min: 0, max: 1.6 };

// --- Virtual Device Chart Data Buffers ---
export let voltageChartDataMap: { [deviceId: string]: number[] } = {};
export let currentChartDataMap: { [deviceId: string]: number[] } = {};

// --- Virtual Device Value Generation ---
function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generateVirtualDeviceValues(device: Device, index: number) {
  const deviceVolt = Math.round(
    randomInRange(VOLTAGE_RANGE.min, VOLTAGE_RANGE.max) + index * 2
  );
  const deviceCurr =
    Math.round(randomInRange(CURRENT_RANGE.min, CURRENT_RANGE.max) * 100) /
      100 +
    index * 0.1;
  return { deviceVolt, deviceCurr };
}

// --- Virtual Device Alarm Check ---
export function checkVirtualDeviceAlarms(
  deviceVolt: number,
  deviceCurr: number
) {
  let alarm = false;
  if (
    deviceVolt < VOLTAGE_ALARM_RANGE.min ||
    deviceVolt > VOLTAGE_ALARM_RANGE.max
  )
    alarm = true;
  if (
    deviceCurr < CURRENT_ALARM_RANGE.min ||
    deviceCurr > CURRENT_ALARM_RANGE.max
  )
    alarm = true;
  return alarm;
}

// --- Export helpers for use in DeviceStore.ts and elsewhere ---
export { validDevicePaths, devicePathMap };

// --- VirtualDeviceStore: All Virtual device logic separated from DeviceStore ---

export let devices: Device[] = [];
export let logData: any[] = [];
let ws: WebSocket | null = null;
let isInitialized = false;
const listeners: Array<(devices: Device[]) => void> = [];

export const subscribeToDeviceUpdates = (
  callback: (devices: Device[]) => void
) => {
  listeners.push(callback);
  if (isInitialized) callback(devices);
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener(devices));
};

function notifySchemaListeners() {
  console.log();
  listeners.forEach((listener) => listener(devices));
}

const initializeWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  const serverUrl = "ws://192.168.31.31:8080";
  ws = new WebSocket(serverUrl);
  ws.onopen = () => {
    console.log("OnOpen was called");
  };
  ws.onmessage = (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (error) {
      return;
    }
    if (message.type === "schema") {
      const wdxDevices = message.devices || [];
      if (!Array.isArray(wdxDevices)) return;
      if (isSchemaChanged(wdxDevices)) {
        validDevicePaths = new Set();
        wdxDevices.forEach((device) => {
          const deviceName = device.name;
          validDevicePaths.add(`Virtual.${deviceName}.volt`);
          validDevicePaths.add(`Virtual.${deviceName}.curr`);
          validDevicePaths.add(`Virtual.${deviceName}.addr1`);
          validDevicePaths.add(`Virtual.${deviceName}.baud1`);
          validDevicePaths.add(`Virtual.${deviceName}.baud2`);
          validDevicePaths.add(`Virtual.${deviceName}.check1`);
          validDevicePaths.add(`Virtual.${deviceName}.check2`);
          validDevicePaths.add(`Virtual.${deviceName}.stopBit1`);
          validDevicePaths.add(`Virtual.${deviceName}.stopBit2`);
          validDevicePaths.add(`Virtual.${deviceName}.lat`);
          validDevicePaths.add(`Virtual.${deviceName}.lng`);
        });
        devicePathMap = {};
        wdxDevices.forEach((device) => {
          const deviceName = device.name;
          devicePathMap[deviceName] = `Virtual.${deviceName}`;
        });
        updateDevicesFromWDX(
          wdxDevices.map((device) => ({
            name: device.name,
            config: device.config || {
              addr1: 0,
              baud1: 0,
              check1: 0,
              stopBit1: 0,
              baud2: 0,
              check2: 0,
              stopBit2: 0,
              lat: 40,
              lng: 28,
            },
          }))
        );
        lastSchemaDevices = wdxDevices.map((d) => ({
          name: d.name,
          config: d.config,
        }));

        isInitialized = true;
        notifySchemaListeners();
      }
    } else if (message.type === "data") {
      updateDeviceFromWDXData(message.path, message.value);
    } else if (message.type === "configUpdated") {
      updateDeviceFromWDXData(message.path, message.config);
    } else if (message.type === "updateLogs") {
      logData = message.logs;
    }
  };
  ws.onclose = () => {
    isInitialized = false;
    ws = null;
    setTimeout(initializeWebSocket, 5000);
  };
  ws.onerror = () => {};
};

initializeWebSocket();

export const updateDeviceConfig = (
  idOrName: string,
  config: Device["config"]
) => {
  let device =
    devices.find((d) => d.id === idOrName) ||
    devices.find((d) => d.name === idOrName);
  if (device) {
    device.config = config;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const deviceName = device.name.replace("Analyzer - ", "");
      const devicePath = devicePathMap[deviceName];
      if (devicePath) {
        Object.entries(config).forEach(([key, value]) => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "setConfig",
                path: devicePath,
                config: { [key]: value },
              })
            );
          }
        });
      }
    }
    notifyListeners();
  }
};

export const updateDevicesFromWDX = (
  wdxDevices: { name: string; config: Device["config"] }[]
) => {
  wdxDevices.forEach((wdxDevice, index) => {
    const deviceName = wdxDevice.name;
    const fullName = `Analyzer - ${deviceName}`;
    let device = devices.find((d) => d.name === fullName);

    if (!device) {
      device = {
        id: (index + 1).toString(),
        name: fullName,
        latitude: 41.0 + index * 0.01,
        longitude: 29.0 + index * 0.01,
        address: "",
        voltageRange: "230V",
        status: "Active",
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

      devices.push(device);
    } else if (wdxDevice.config && Object.keys(wdxDevice.config).length > 0) {
      device.config = wdxDevice.config;
    }
  });
};

export const updateDeviceFromWDXData = (path: string, value: any) => {
  const deviceName = path.split(".").pop() || "";
  const device = devices.find((d) => d.name === `Analyzer - ${deviceName}`);
  if (device && value) {
    let hasConfigChange = false;
    const updatedConfig = { ...device.config };
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === "number") {
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
        }
      }
    });
    if (hasConfigChange) {
      device.config = updatedConfig;
      notifyListeners();
    }
  }
};

let lastSchemaDevices: { name: string; config: Device["config"] }[] = [];
function isSchemaChanged(
  newSchema: { name: string; config: Device["config"] }[]
) {
  if (lastSchemaDevices.length !== newSchema.length) return true;
  for (let i = 0; i < newSchema.length; i++) {
    if (lastSchemaDevices[i].name !== newSchema[i].name) return true;
  }
  return false;
}

export const getLogs = (deviceName: string) => {
  let result = deviceName.startsWith("Analyzer")
    ? deviceName.split(" - ")[1]?.trim()
    : deviceName;
  ws?.send(
    JSON.stringify({
      type: "getLogs",
      deviceName: result,
    })
  );
};

export const addVirtualDevice = (device: Device) => {
  try {
    console.log("Sending device info");
    ws?.send(
      JSON.stringify({
        type: "addDevice",
        path: "Virtual.",
        device: device,
      })
    );
  } catch (e) {
    console.error(e);
  }
};

interface AlarmEvent {
  type: "volt" | "curr";
  value: number;
  deviceName: string;
}
const alarmListeners: Array<(alarm: AlarmEvent) => void> = [];
export const subscribeToAlarms = (cb: (alarm: AlarmEvent) => void) => {
  alarmListeners.push(cb);
  return () => {
    const idx = alarmListeners.indexOf(cb);
    if (idx !== -1) alarmListeners.splice(idx, 1);
  };
};
