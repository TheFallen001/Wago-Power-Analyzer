/**
 * @description Thse are gonna be update later. leave them for now
 * 
 */
// ModbusDeviceStore.ts
// Handles all Modbus device logic for the frontend, separated from DeviceStore

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


export let ModbusDevices: Device[] = [];
export let logData: any[] = [];
let devicePathMap: { [key: string]: string } = {};
let ws: WebSocket | null = null;
let isInitialized = false;
const listeners: Array<(devices: Device[]) => void> = [];
let validDevicePaths: Set<string> = new Set();

export const subscribeToDeviceUpdates = (callback: (devices: Device[]) => void) => {
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

const IPADDRESS = "localhost";

const initializeWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return;
  const serverUrl = `ws://${IPADDRESS}:8080`;
  ws = new WebSocket(serverUrl);
  ws.onopen = () => {console.log("It's been opened")};
  ws.onmessage = (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (error) { return; }
    if (message.type === "schema") {
      const wdxDevices = message.devices || [];
      if (!Array.isArray(wdxDevices)) return;
      if (isSchemaChanged(wdxDevices)) {
        validDevicePaths = new Set();
        wdxDevices.forEach((device) => {
          const deviceName = device.name;
          // Config variables
          validDevicePaths.add(`Modbus.${deviceName}.Addr1`);
          validDevicePaths.add(`Modbus.${deviceName}.Baud1`);
          validDevicePaths.add(`Modbus.${deviceName}.Check1`);
          validDevicePaths.add(`Modbus.${deviceName}.Baud2`);
          validDevicePaths.add(`Modbus.${deviceName}.Check2`);
          validDevicePaths.add(`Modbus.${deviceName}.645Addr`);
          validDevicePaths.add(`Modbus.${deviceName}.Language`);
          // Graph variables
          validDevicePaths.add(`Modbus.${deviceName}.F`);
          validDevicePaths.add(`Modbus.${deviceName}.PF`);
          validDevicePaths.add(`Modbus.${deviceName}.QT`);
          validDevicePaths.add(`Modbus.${deviceName}.PT`);
          validDevicePaths.add(`Modbus.${deviceName}.UA`);
          validDevicePaths.add(`Modbus.${deviceName}.IA`);
        });
        devicePathMap = {};
        wdxDevices.forEach((device) => {
          const deviceName = device.name;
          devicePathMap[deviceName] = `Modbus.${deviceName}`;
        });
        updateDevicesFromWDX(
          wdxDevices.map((device) => ({
            name: device.name,
            config: device.config || {
              Addr1: 0,
              Baud1: 0,
              Check1: 0,
              Baud2: 0,
              Check2: 0,
              "645Addr": 0,
              Language: 0,
              F: 0, PF: 0, QT: 0, PT: 0, UA: 0, IA: 0,
            },
          }))
        );
        lastSchemaDevices = wdxDevices.map((d) => ({ name: d.name, config: d.config }));
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

export const updateDeviceConfig = (idOrName: string, config: ModbusConfig) => {
  let device = ModbusDevices.find((d) => d.id === idOrName) || ModbusDevices.find((d) => d.name === idOrName);
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

export const updateDevicesFromWDX = (wdxDevices: { name: string; config: ModbusConfig }[]) => {
  wdxDevices.forEach((wdxDevice, index) => {
    const deviceName = wdxDevice.name;
    const fullName = `Analyzer - ${deviceName}`;
    let device = ModbusDevices.find((d) => d.name === fullName);
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
  const device = ModbusDevices.find((d) => d.name === `Analyzer - ${deviceName}`);
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

export const addModbusDevice = () => {
  console.log("add device was called")
  try {
    console.log("Sending device info");
    ws?.send(
      JSON.stringify({
        type: "addDevice",
        path: "Modbus.",
      })
    );
  } catch (e) {
    console.error(e);
  }
};

