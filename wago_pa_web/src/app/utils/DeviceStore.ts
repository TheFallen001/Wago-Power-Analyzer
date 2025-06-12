// DeviceStore singleton for web, ported from React Native app
import { useEffect, useState } from "react";
import { useWagoWebSocket } from "./useWagoWebSocket";

export type Device = {
  currentMax: number;
  currentMin: number;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  voltageRange: string;
  status: string;
  config: {
    addr1: number;
    baud1: number;
    check1: number;
    stopBit1: number;
    baud2: number;
    check2: number;
    stopBit2: number;
  };
};

// --- Singleton State ---
const devices: Device[] = [];
let logData: any[] = [];
let devicePathMap: { [key: string]: string } = {};
let ws: WebSocket | null = null;
let isInitialized = false;
const listeners: Array<(devices: Device[]) => void> = [];
let validDevicePaths: Set<string> = new Set();
let lastSchemaDevices: { name: string; config: Device["config"] }[] = [];

// Chart/Alarm simulation
export let voltageChartDataMap: { [deviceId: string]: number[] } = {};
export let currentChartDataMap: { [deviceId: string]: number[] } = {};
const alarmListeners: Array<(alarm: AlarmEvent) => void> = [];

// --- Alarm Subscription for Web (shared for all pages) ---
interface AlarmEvent {
  type: 'volt' | 'curr';
  value: number;
  deviceName: string;
}

const alarmHistoryListeners: Array<(alarm: AlarmEvent) => void> = [];

export const subscribeToAlarms = (cb: (alarm: AlarmEvent) => void) => {
  alarmListeners.push(cb);
  alarmHistoryListeners.push(cb);
  return () => {
    const idx = alarmListeners.indexOf(cb);
    if (idx !== -1) alarmListeners.splice(idx, 1);
    const idx2 = alarmHistoryListeners.indexOf(cb);
    if (idx2 !== -1) alarmHistoryListeners.splice(idx2, 1);
  };
};

export const VOLTAGE_ALARM_RANGE = { min: 215, max: 236 };
export const CURRENT_ALARM_RANGE = { min: 0, max: 1.6 };

// --- Listeners ---
export const subscribeToDeviceUpdates = (cb: (devices: Device[]) => void) => {
  listeners.push(cb);
  if (isInitialized) cb(devices);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};
const notifyListeners = () => listeners.forEach((cb) => cb(devices));

// Only notify listeners for schema changes or device add/remove, not for config/data updates
function notifySchemaListeners() {
  listeners.forEach((cb) => cb(devices));
}

// --- WebSocket Logic ---
function initializeWebSocket() {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  ws = new WebSocket("ws://192.168.31.214:8080");
  ws.onopen = () => {};
  ws.onmessage = (event) => {
    let message;
    try { message = JSON.parse(event.data); } catch { return; }
    if (message.type === "schema") {
      const wdxDevices = message.devices || [];
      if (isSchemaChanged(wdxDevices)) {
        validDevicePaths = new Set();
        (wdxDevices as Array<{ name: string; config: Device["config"] }>).forEach((device) => {
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
        });
        devicePathMap = {};
        (wdxDevices as Array<{ name: string; config: Device["config"] }>).forEach((device) => {
          const deviceName = device.name;
          devicePathMap[deviceName] = `Virtual.${deviceName}`;
        });
        updateDevicesFromWDX(
          (wdxDevices as Array<{ name: string; config: Device["config"] }>).map((device) => ({
            name: device.name,
            config: device.config || {
              addr1: 0, baud1: 0, check1: 0, stopBit1: 0, baud2: 0, check2: 0, stopBit2: 0,
            },
          }))
        );
        lastSchemaDevices = (wdxDevices as Array<{ name: string; config: Device["config"] }> ).map((d) => ({ name: d.name, config: d.config }));
        isInitialized = true;
        notifySchemaListeners(); // Only notify on schema change
      }
    } else if (message.type === "data") {
      updateDeviceFromWDXData(message.path, message.value);
      // Do NOT call notifyListeners();
    } else if (message.type === "set") {
      // set request from client
    } else if (message.type === "configUpdated") {
      updateDeviceFromWDXData(message.path, message.config);
      // Do NOT call notifyListeners();
    } else if (message.type === "configUpdateError") {
      // handle config update error
    } else if (message.type === "updateLogs") {
      logData = message.logs;
    }
  };
  ws.onclose = () => { isInitialized = false; ws = null; setTimeout(initializeWebSocket, 5000); };
  ws.onerror = () => {};
}
if (typeof window !== "undefined") initializeWebSocket();

function isSchemaChanged(newSchema: { name: string; config: Device["config"] }[]) {
  if (lastSchemaDevices.length !== newSchema.length) return true;
  for (let i = 0; i < newSchema.length; i++) {
    if (lastSchemaDevices[i].name !== newSchema[i].name) return true;
  }
  return false;
}

// --- Device CRUD/Config ---
export const updateDeviceConfig = (idOrName: string, config: Device["config"]) => {
  let device = devices.find((d) => d.id === idOrName) || devices.find((d) => d.name === idOrName);
  if (device) {
    device.config = config;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const deviceName = device.name.replace("Analyzer - ", "");
      const devicePath = devicePathMap[deviceName];
      if (devicePath) {
        Object.entries(config).forEach(([key, value]) => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "setConfig", path: devicePath, config: { [key]: value } }));
          }
        });
      }
    }
    notifyListeners();
  }
};

export const updateDevicesFromWDX = (wdxDevices: { name: string; config: Device["config"] }[]) => {
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
          addr1: 1, baud1: 9600, check1: 0, stopBit1: 0, baud2: 9600, check2: 0, stopBit2: 0,
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
    // Only update config fields, ignore volt/curr updates
    let hasConfigChange = false;
    const updatedConfig = { ...device.config };
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === "number") {
        // Only update if not volt/curr and not a redundant update
        if (
          key === "Addr1" || key === "addr1" ||
          key === "Baud1" || key === "baud1" ||
          key === "Check Digit 1" || key === "check1" ||
          key === "Stop Bit 1" || key === "stopBit1" ||
          key === "Baud2" || key === "baud2" ||
          key === "Check Digit 2" || key === "check2" ||
          key === "Stop Bit 2" || key === "stopBit2"
        ) {
          if (key === "Addr1" || key === "addr1") { if (updatedConfig.addr1 !== val) { updatedConfig.addr1 = val; hasConfigChange = true; } }
          else if (key === "Baud1" || key === "baud1") { if (updatedConfig.baud1 !== val) { updatedConfig.baud1 = val; hasConfigChange = true; } }
          else if (key === "Check Digit 1" || key === "check1") { if (updatedConfig.check1 !== val) { updatedConfig.check1 = val; hasConfigChange = true; } }
          else if (key === "Stop Bit 1" || key === "stopBit1") { if (updatedConfig.stopBit1 !== val) { updatedConfig.stopBit1 = val; hasConfigChange = true; } }
          else if (key === "Baud2" || key === "baud2") { if (updatedConfig.baud2 !== val) { updatedConfig.baud2 = val; hasConfigChange = true; } }
          else if (key === "Check Digit 2" || key === "check2") { if (updatedConfig.check2 !== val) { updatedConfig.check2 = val; hasConfigChange = true; } }
          else if (key === "Stop Bit 2" || key === "stopBit2") { if (updatedConfig.stopBit2 !== val) { updatedConfig.stopBit2 = val; hasConfigChange = true; } }
        }
        // Ignore volt/curr updates for config
      }
    });
    // Only update and notify if the update is not a volt/curr and not redundant
    if (hasConfigChange) {
      device.config = updatedConfig;
      notifyListeners();
    }
  }
};

export const addDevice = async (device: Device) => {
  devices.push(device);
  ws?.send(
    JSON.stringify({
      type: "addDevice",
      path: device.name,
      relative_path: "Virtual",
      device,
    })
  );
  notifyListeners();
};

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

// --- Chart/Alarm Simulation ---
const VOLTAGE_RANGE = { min: 215, max: 240 };
const CURRENT_RANGE = { min: 0, max: 2.0 };
const lastChartUpdateTime: { [deviceId: string]: number } = {};
const CHART_UPDATE_INTERVAL = 5000;
const lastGeneratedValues: { [deviceId: string]: { volt: number; curr: number } } = {};
if (typeof window !== "undefined") {
  setInterval(() => {
    devices.forEach((device, index) => {
      const now = Date.now();
      let deviceVolt: number, deviceCurr: number;
      let shouldSend = false;
      if (!lastChartUpdateTime[device.id] || now - lastChartUpdateTime[device.id] >= CHART_UPDATE_INTERVAL) {
        deviceVolt = Math.round(Math.random() * (VOLTAGE_RANGE.max - VOLTAGE_RANGE.min) + VOLTAGE_RANGE.min + index * 2);
        deviceCurr = Math.round((Math.random() * (CURRENT_RANGE.max - CURRENT_RANGE.min) + CURRENT_RANGE.min) * 100) / 100 + index * 0.1;
        lastGeneratedValues[device.id] = { volt: deviceVolt, curr: deviceCurr };
        lastChartUpdateTime[device.id] = now;
        shouldSend = true;
        if (!voltageChartDataMap[device.id]) voltageChartDataMap[device.id] = [];
        if (!currentChartDataMap[device.id]) currentChartDataMap[device.id] = [];
        voltageChartDataMap[device.id].push(deviceVolt);
        currentChartDataMap[device.id].push(deviceCurr);
        if (voltageChartDataMap[device.id].length > 10) voltageChartDataMap[device.id].shift();
        if (currentChartDataMap[device.id].length > 10) currentChartDataMap[device.id].shift();
      } else {
        const last = lastGeneratedValues[device.id];
        deviceVolt = last ? last.volt : 220;
        deviceCurr = last ? last.curr : 1.0;
      }
      const deviceName = device.name.replace("Analyzer - ", "");
      const voltPath = `Virtual.${deviceName}.volt`;
      const currPath = `Virtual.${deviceName}.curr`;
      if (shouldSend && ws && ws.readyState === WebSocket.OPEN && validDevicePaths.has(voltPath)) {
        ws.send(JSON.stringify({ type: "setConfig", path: voltPath, config: { volt: deviceVolt } }));
      }
      if (shouldSend && ws && ws.readyState === WebSocket.OPEN && validDevicePaths.has(currPath)) {
        ws.send(JSON.stringify({ type: "setConfig", path: currPath, config: { curr: deviceCurr } }));
      }
      let alarm = false;
      if (deviceVolt < VOLTAGE_ALARM_RANGE.min || deviceVolt > VOLTAGE_ALARM_RANGE.max) {
        alarmListeners.forEach((cb) => cb({ type: "volt", value: deviceVolt, deviceName: device.name }));
        alarmHistoryListeners.forEach((cb) => cb({ type: "volt", value: deviceVolt, deviceName: device.name }));
        alarm = true;
      }
      if (deviceCurr < CURRENT_ALARM_RANGE.min || deviceCurr > CURRENT_ALARM_RANGE.max) {
        alarmListeners.forEach((cb) => cb({ type: "curr", value: deviceCurr, deviceName: device.name }));
        alarmHistoryListeners.forEach((cb) => cb({ type: "curr", value: deviceCurr, deviceName: device.name }));
        alarm = true;
      }
      device.status = alarm ? "ALARM" : "Active";
    });
    // Do NOT call notifyListeners();
  }, 1000);
}

// --- React Hook for Live Devices ---
export function useDevices() {
  const [state, setState] = useState<Device[]>(devices);
  useEffect(() => {
    const unsub = subscribeToDeviceUpdates(setState);
    return () => unsub();
  }, []);
  return { devices: state };
}

// --- Logs Accessor ---
export function useLogs() {
  const [logs, setLogs] = useState<any[]>(logData);
  useEffect(() => {
    const interval = setInterval(() => setLogs([...logData]), 1000);
    return () => clearInterval(interval);
  }, []);
  return logs;
}
