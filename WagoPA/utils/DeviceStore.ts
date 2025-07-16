// DeviceStore.ts
// Only contains shared types and utilities. All device logic is now in VirtualDeviceStore and ModbusDeviceStore.
import wdxHelper, { Device } from "./wdx-helpers";
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY || "";
// google maps API key

//your ipaddress
const IPADDRESS = "192.168.31.91";

//Websocket server instance
let ws: WebSocket | null = null;

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
      if (wdxHelper.isSchemaChanged(wdxDevices)) {
        wdxHelper.validDevicePaths = new Set();
        wdxDevices.forEach((device) => {
          const deviceName = device.name;
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.volt`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.curr`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.addr1`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.baud1`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.baud2`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.check1`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.check2`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.stopBit1`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.stopBit2`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.lat`);
          wdxHelper.validDevicePaths.add(`MODBUS.${deviceName}.lng`);
        });
        wdxHelper.devicePathMap = {};
        wdxDevices.forEach((device) => {
          const deviceName = device.name;
          wdxHelper.devicePathMap[deviceName] = `Virtual.${deviceName}`;
        });
        wdxHelper.updateDevicesFromWDX(
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
        wdxHelper.lastSchemaDevices = wdxDevices.map((d) => ({
          name: d.name,
          config: d.config,
        }));

        wdxHelper.isInitialized = true;
        wdxHelper.notifySchemaListeners();
      }
    } else if (message.type === "data") {
      wdxHelper.updateDeviceFromWDXData(message.path, message.value);
    } else if (message.type === "configUpdated") {
      wdxHelper.updateDeviceFromWDXData(message.path, message.config);
    } 
  };
  ws.onclose = () => {
    wdxHelper.isInitialized = false;
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
    wdxHelper.devices.find((d) => d.id === idOrName) ||
    wdxHelper.devices.find((d) => d.name === idOrName);
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
                device: device,
                config: { [key]: value },
              })
            );
            // console.log("Sent full message:", {
            //   type: "setConfig",
            //   path: devicePath,
            //   device: { deviceType: "MODBUS", name: deviceName },
            //   config: { [key]: value },
            // });
          }
        });
      }
    }
    wdxHelper.notifyListeners();
  }
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
        wdxHelper.logData = data.logs;
        onReceived(data.logs); // trigger the callback
      }
    };
  }
}

export interface ModbusInfo {
  hostAddress: string | undefined;
  port: number | undefined;
  clientID: number | undefined;
}

export function addDevice(device: Device, modbusInfo: ModbusInfo): void {
  let instanceType = device.deviceType === "Virtual" ? "Virtual" : "MODBUS";
  modbusInfo.clientID ??= 0;
  modbusInfo.hostAddress ??= "127.0.0.1";
  modbusInfo.port ??= 502;

  try {
    console.log("Sending device info");
    ws?.send(
      JSON.stringify({
        type: "addDevice",
        path: instanceType + ".",
        device: device,
        modbusInfo: modbusInfo,
      })
    );
  } catch (e) {
    console.error(e);
  }
}

export const updateAddress = ({
  location,
  deviceName,
}: {
  location: { latitude: number; longitude: number };
  deviceName: string;
}): void => {
  try {
    console.log("Updating Address");
    ws?.send(
      JSON.stringify({
        type: "updateAddress",
        path: "Virtual.",
        deviceName: deviceName,
        location: location,
      })
    );
  } catch (e) {
    console.error(e);
  }
};

// Google Geocoding utility functions

export async function geocodeAddress(
  address: string
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    }
    return null;
  } catch (e) {
    console.error("Geocoding error:", e);
    return null;
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (e) {
    console.error("Reverse geocoding error:", e);
    return null;
  }
}

export default wdxHelper;
export { Device };

// --- Virtual Device Simulation Ranges ---
export const VOLTAGE_RANGE = { min: 215, max: 240 };
export const CURRENT_RANGE = { min: 0, max: 2.0 };
export const VOLTAGE_ALARM_RANGE = { min: 215, max: 236 };
export const CURRENT_ALARM_RANGE = { min: 0, max: 1.6 };

// --- Virtual Device Chart Data Buffers ---
export let voltageChartDataMap: { [deviceId: string]: number[] } = {};
export let currentChartDataMap: { [deviceId: string]: number[] } = {};

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

// --- Virtual Device Value Generation ---
function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
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
