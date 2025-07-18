// --- Alarm subscription for Modbus devices ---
type ModbusAlarm = {
  deviceName: string;
  type: string;
  value: number;
};
const alarmListeners: Array<(alarm: ModbusAlarm) => void> = [];

export function subscribeToModbusAlarms(callback: (alarm: ModbusAlarm) => void) {
  alarmListeners.push(callback);
  return () => {
    const idx = alarmListeners.indexOf(callback);
    if (idx !== -1) alarmListeners.splice(idx, 1);
  };
}
// ModbusDeviceStore.ts (web)
// Handles all Modbus device logic for the web frontend, separated from DeviceStore

import { geocodeAddress, reverseGeocode, Device } from "./DeviceStore";
import { useEffect, useState } from "react";

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

// Fix: Export the correct type for ModbusDevices and use ModbusDevice everywhere
export type ModbusDevice = Omit<Device, "config"> & { config: ModbusConfig };

export let ModbusDevices: ModbusDevice[] = [];
export let logData: any[] = [];
let devicePathMap: { [key: string]: string } = {};
let ws: WebSocket | null = null;
let isInitialized = false;
const listeners: Array<(devices: ModbusDevice[]) => void> = [];
let validDevicePaths: Set<string> = new Set();

export const subscribeToDeviceUpdates = (callback: (devices: ModbusDevice[]) => void) => {
  listeners.push(callback);
  if (isInitialized) callback(ModbusDevices);
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener(ModbusDevices));
};

function notifySchemaListeners() {
  listeners.forEach((listener) => listener(ModbusDevices));
}

const IPADDRESS = "192.168.31.138";

//Websocket server instance
//initializing web socket server
const initializeWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  const serverUrl = `ws://${IPADDRESS}:8080`;
  ws = new WebSocket(serverUrl);

  ws.onopen = () => {
    console.log("Server has started...");
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
          validDevicePaths.add(`MODBUS.${deviceName}.volt`);
          validDevicePaths.add(`MODBUS.${deviceName}.curr`);
          validDevicePaths.add(`MODBUS.${deviceName}.addr1`);
          validDevicePaths.add(`MODBUS.${deviceName}.baud1`);
          validDevicePaths.add(`MODBUS.${deviceName}.baud2`);
          validDevicePaths.add(`MODBUS.${deviceName}.check1`);
          validDevicePaths.add(`MODBUS.${deviceName}.check2`);
          validDevicePaths.add(`MODBUS.${deviceName}.stopBit1`);
          validDevicePaths.add(`MODBUS.${deviceName}.stopBit2`);
          validDevicePaths.add(`MODBUS.${deviceName}.lat`);
          validDevicePaths.add(`MODBUS.${deviceName}.lng`);
        });
        wdxDevices.forEach((device) => {
        const deviceName = device.name.replace("Analyzer - ", "");
        devicePathMap[deviceName] = `MODBUS.${deviceName}`;
        console.log(`Adding to devicePathMap: ${deviceName} -> ${devicePathMap[deviceName]}`);
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

export function updateDeviceConfig(
  idOrName: string,
  config: Device["config"]
): void {
  let device =
    ModbusDevices.find((d) => d.id === idOrName) ||
    ModbusDevices.find((d) => d.name === idOrName);
  if (device) {
    device.deviceType = "MODBUS";
    device.config = config;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const deviceName = device.name.replace("Analyzer - ", "");
      const devicePath = "MODBUS." + deviceName;
      
      if (devicePath) {
        Object.entries(config).forEach(([key, value]) => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "setConfig",
                path: devicePath,
                device: { deviceType: "MODBUS", name: deviceName }, // Ensure this is included
                config: { [key]: value },
              })
            );
            console.log("Sent full message:", {
              type: "setConfig",
              path: devicePath,
              device: { deviceType: "MODBUS", name: deviceName },
              config: { [key]: value },
            });
          }
        });
      }
    }
    notifyListeners();
  }
}

export const updateDevicesFromWDX = (wdxDevices: { name: string; config: ModbusConfig }[]) => {
  console.log("[ModbusDeviceStore] updateDevicesFromWDX called with:", wdxDevices);
  wdxDevices.forEach((wdxDevice, index) => {
    const deviceName = wdxDevice.name;
    let device = ModbusDevices.find((d) => d.name === deviceName);
    if (!device) {
      device = {
        id: (index + 1).toString(),
        name: deviceName,
        deviceType: "MODBUS",
        latitude: 41.0 + index * 0.01,
        longitude: 29.02 + index * 0.01,
        address: "",
        voltageRange: "230V",
        status: "Active",
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
          F: 0, PF: 0, QT: 0, PT: 0, UA: 0, IA: 0,
        },
      };
      ModbusDevices.push(device);
    } else if (wdxDevice.config && Object.keys(wdxDevice.config).length > 0) {
      device.config = wdxDevice.config;
    }
  });
};

export const updateDeviceFromWDXData = (path: string, value: any) => {
  const deviceName = path.split(".").pop() || "";
  const device = ModbusDevices.find((d) => d.name === deviceName);
  if (device && value) {
    let hasConfigChange = false;
    const updatedConfig = { ...device.config };
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === "number") {
        if (
          key === "Addr1" || key === "Baud1" || key === "Check1" ||
          key === "Baud2" || key === "Check2" || key === "645Addr" || key === "Language"
        ) {
          if (updatedConfig[key] !== val) { updatedConfig[key] = val; hasConfigChange = true; }
        } else if (
          key === "F" || key === "PF" || key === "QT" || key === "PT" || key === "UA" || key === "IA"
        ) {
          updatedConfig[key] = val; // Always update graph values
        }
      }
    });
    if (hasConfigChange) {
      device.config = updatedConfig;
      notifyListeners();
    }
  }
};

let lastSchemaDevices: { name: string; config: ModbusConfig }[] = [];
function isSchemaChanged(newSchema: { name: string; config: ModbusConfig }[]) {
  if (lastSchemaDevices.length !== newSchema.length) return true;
  for (let i = 0; i < newSchema.length; i++) {
    if (lastSchemaDevices[i].name !== newSchema[i].name) return true;
  }
  return false;
}

export function getLogs(deviceName: string,onReceived: (logs: string) => void) {
  let result = deviceName.startsWith("Analyzer")
    ? deviceName.split(" - ")[1]?.trim()
    : deviceName;
  ws?.send(
    JSON.stringify({
      type: "getLogs",
      deviceName: result,
    })
  );
  if (ws) {
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "updateLogs") {
        logData = data.logs;
        onReceived(data.logs); // trigger the callback
      }
    };
  }
}

export function addModbusDevice(device: Device, modbusInfo: any): void {
  modbusInfo.clientID ??= 0;
  modbusInfo.hostAddress ??= "127.0.0.1";
  modbusInfo.port ??= 502;

  try {
    console.log("Sending device info");
    ws?.send(
      JSON.stringify({
        type: "addDevice",
        path: "MODBUS.",
        device: device,
        modbusInfo: modbusInfo,
      })
    );
  } catch (e) {
    console.error(e);
  }
}

export function useModbusDevices() {
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  useEffect(() => {
    const unsubscribe = subscribeToDeviceUpdates((newDevices) => {
      setDevices([...newDevices]);
    });
    return unsubscribe;
  }, []);
  return { devices };
}