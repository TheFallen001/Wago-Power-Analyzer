// VirtualDeviceStore.ts (web)
// Handles all Virtual device logic for the web frontend, separated from DeviceStore

import { geocodeAddress, reverseGeocode, Device } from "./DeviceStore";
import { useEffect, useState } from "react";

export let devices: Device[] = [];
export let logData: string = "";
let devicePathMap: { [key: string]: string } = {};
let ws: WebSocket | null = null;
let isInitialized = false;
const listeners: Array<(devices: Device[]) => void> = [];
const liveValueListeners: Array<(devices: Device[]) => void> = [];
let validDevicePaths: Set<string> = new Set();

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

export const subscribeToLiveValueUpdates = (
  callback: (devices: Device[]) => void
) => {
  liveValueListeners.push(callback);
  callback(devices);
  return () => {
    const index = liveValueListeners.indexOf(callback);
    if (index !== -1) liveValueListeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener(devices));
};

const notifyLiveValueListeners = () => {
  liveValueListeners.forEach((listener) => listener(devices));
};

function notifySchemaListeners() {
  listeners.forEach((listener) => listener(devices));
}

const initializeWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  const serverUrl = "ws://localhost:8080";
  ws = new WebSocket(serverUrl);
  ws.onopen = () => {};
  ws.onmessage = (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (error) {
      console.error(error);
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
          validDevicePaths.add(`Virtual.${deviceName}.volt`);
          validDevicePaths.add(`Virtual.${deviceName}.curr`);
          validDevicePaths.add(`Virtual.${deviceName}.energy`);
          validDevicePaths.add(`Virtual.${deviceName}.power`);
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
  const device =
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
        },
      };
      devices.push(device);
    } else if (wdxDevice.config && Object.keys(wdxDevice.config).length > 0) {
      device.config = wdxDevice.config;
    }
  });
};

export const updateDeviceFromWDXData = (path: string, value: any) => {
  // Parse device name from path: 'Virtual.Device1.volt' => 'Device1'
  const parts = path.split(".");
  const deviceName = parts.length > 1 ? parts[1] : "";
  const device = devices.find((d) => d.name === `Analyzer - ${deviceName}`);
  if (device && value) {
    let hasConfigChange = false;
    let hasLiveValueChange = false;
    const updatedConfig = { ...device.config };
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === "number") {
        // Config keys (only these trigger notifyListeners)
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
          if (updatedConfig[key] !== val) {
            updatedConfig[key] = val;
            hasConfigChange = true;
          }
        } else {
          // Live value keys: update and trigger live listeners
          if (updatedConfig[key] !== val) {
            updatedConfig[key] = val;
            hasLiveValueChange = true;
          }
        }
      }
    });
    device.config = updatedConfig;
    if (hasConfigChange) {
      console.log(`[WDX] Config change for '${device.name}':`, updatedConfig);
      notifyListeners();
    }
    if (hasLiveValueChange) {
      notifyLiveValueListeners();
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

// Simulate device data every 5 seconds
type SimKey = "volt" | "curr" | "energy" | "power";
const SIM_KEYS: SimKey[] = ["volt", "curr", "energy", "power"];

declare global {
  interface Window {
    __VIRTUAL_SIM_STARTED__?: boolean;
  }
}

function sendSimulatedData(deviceName: string, key: SimKey, value: number) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  let path =
    key === "volt" || key === "curr"
      ? `Virtual.${deviceName}.${key}`
      : `Virtual.${deviceName}`;
  ws.send(
    JSON.stringify({
      type: "setConfig",
      path,
      config: { [key]: value },
    })
  );
}

function startSimulationInterval() {
  setInterval(() => {
    devices.forEach((device: Device) => {
      SIM_KEYS.forEach((key) => {
        let value = 0;
        switch (key) {
          case "volt":
            value = 200 + Math.random() * 50;
            break;
          case "curr":
            value = Math.random() * 10;
            break;
          case "energy":
            value = (device.config.energy || 0) + Math.random() * 100;
            break;
          case "power":
            value = Math.random() * 100;
            break;
        }
        sendSimulatedData(device.name.replace("Analyzer - ", ""), key, value);
      });
    });
  }, 5000);
}

if (typeof window !== "undefined") {
  if (!(window as Window).__VIRTUAL_SIM_STARTED__) {
    (window as Window).__VIRTUAL_SIM_STARTED__ = true;
    setTimeout(() => startSimulationInterval(), 3000);
  }
}

// React hook to get devices with subscription
export function useDevices() {
  const [deviceList, setDeviceList] = useState<Device[]>([...devices]);
  useEffect(() => {
    const unsubscribe = subscribeToDeviceUpdates((newDevices) => {
      setDeviceList([...newDevices]);
    });
    return unsubscribe;
  }, []);
  return { devices: deviceList };
}

export function useLiveDevices() {
  const [deviceList, setDeviceList] = useState<Device[]>([...devices]);
  useEffect(() => {
    const unsubscribe = subscribeToLiveValueUpdates((newDevices) => {
      setDeviceList([...newDevices]);
    });
    return unsubscribe;
  }, []);
  return { devices: deviceList };
}

export const addDevice = async (device: Device) => {
  let lat = device.latitude;
  let lng = device.longitude;
  let address = device.address;
  if (address && (!lat || !lng)) {
    const geo = await geocodeAddress(address);
    if (geo) {
      lat = geo.latitude;
      lng = geo.longitude;
    }
  } else if ((!address || address === "") && lat && lng) {
    const addr = await reverseGeocode(lat, lng);
    if (addr) address = addr;
  }
  const newDevice = { ...device, latitude: lat, longitude: lng, address };
  devices.push(newDevice);
  ws?.send(
    JSON.stringify({
      type: "addDevice",
      path: newDevice.name,
      relative_path: "Virtual",
      device: newDevice,
    })
  );
  console.log("New device sent at", new Date().toISOString(), ":", newDevice);
  notifyListeners();
};
