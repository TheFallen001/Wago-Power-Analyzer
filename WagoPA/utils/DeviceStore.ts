export type Device = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
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

export const devices: Device[] = []; // Start with an empty array
let devicePathMap: { [key: string]: string } = {};
let ws: WebSocket | null = null;
let isInitialized = false;
const listeners: Array<(devices: Device[]) => void> = [];

// Notify listeners when devices are updated
const notifyListeners = () => {
  console.log('Notifying listeners with devices at', new Date().toISOString(), ':', devices.map(d => ({ id: d.id, name: d.name })));
  listeners.forEach(listener => listener(devices));
};

// Subscribe to device updates
export const subscribeToDeviceUpdates = (callback: (devices: Device[]) => void) => {
  console.log('New subscriber added, current listeners:', listeners.length + 1, 'at', new Date().toISOString());
  listeners.push(callback);
  if (isInitialized) {
    console.log('Devices already initialized, sending to new subscriber at', new Date().toISOString());
    callback(devices);
  } else {
    console.log('Devices not yet initialized, subscriber will wait at', new Date().toISOString());
  }
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
      console.log('Subscriber removed, current listeners:', listeners.length, 'at', new Date().toISOString());
    }
  };
};

// Initialize WebSocket connection to intermediary server
const initializeWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('WebSocket already connected, skipping initialization at', new Date().toISOString());
    return;
  }

  const serverUrl = 'ws://192.168.31.177:8080'; // Update this to your Node.js server IP if not running locally
  console.log(`Attempting to connect to intermediary server at ${serverUrl} at`, new Date().toISOString());
  ws = new WebSocket(serverUrl);

  ws.onopen = () => {
    console.log('Connected successfully to intermediary server at', new Date().toISOString());
  };

  ws.onmessage = (event) => {
    console.log('WebSocket message received at', new Date().toISOString(), ':', event.data);
    let message;
    try {
      message = JSON.parse(event.data);
      console.log('Parsed message successfully at', new Date().toISOString(), ':', message);
    } catch (error) {
      console.error('Failed to parse WebSocket message at', new Date().toISOString(), ':', event.data, error);
      return;
    }

    if (message.type === 'schema') {
      console.log('Processing schema message at', new Date().toISOString());
      const wdxDevices = message.devices || [];
      if (!Array.isArray(wdxDevices)) {
        console.error('Invalid schema data: devices is not an array at', new Date().toISOString(), ':', message.devices);
        return;
      }

      console.log('Schema devices at', new Date().toISOString(), ':', wdxDevices);
      if (wdxDevices.length === 0) {
        console.log('Schema devices array is empty, no devices to initialize at', new Date().toISOString());
      }

      devicePathMap = {};
      wdxDevices.forEach((device) => {
        const deviceName = device.name;
        devicePathMap[deviceName] = `Virtual.${deviceName}`;
      });
      console.log('Device path map updated at', new Date().toISOString(), ':', devicePathMap);

      updateDevicesFromWDX(wdxDevices.map(device => ({
        name: device.name,
        config: device.config || {
          addr1: 0, baud1: 0, check1: 0, stopBit1: 0,
          baud2: 0, check2: 0, stopBit2: 0,
        },
      })));
      console.log('Devices initialized from schema at', new Date().toISOString(), ':', devices.map(d => ({ id: d.id, name: d.name })));

      if (devices.length > 0) {
        isInitialized = true;
        console.log('Devices successfully initialized, notifying listeners at', new Date().toISOString());
        notifyListeners();
      } else {
        console.log('No devices initialized from schema at', new Date().toISOString());
      }
    } else if (message.type === 'data') {
      console.log('Processing data message at', new Date().toISOString());
      const path = message.path;
      const value = message.value;
      updateDeviceFromWDXData(path, value);
      console.log('Processed data update for path:', path, 'value:', value, 'at', new Date().toISOString());
      notifyListeners();
    } else if (message.type === 'set') {
      console.log('Received set request from client at', new Date().toISOString(), ':', message);
    } else if (message.type === 'configUpdated') {
      // Backend confirms config update, update local device config
      const path = message.path;
      const config = message.config;
      updateDeviceFromWDXData(path, config);
      notifyListeners();
    } else if (message.type === 'configUpdateError') {
      // Handle config update error from backend
      console.error('Config update error from backend:', message);
      // Optionally, notify listeners or show an alert in the UI
    } else {
      console.log('Unknown message type received at', new Date().toISOString(), ':', message.type);
    }
  };

  ws.onclose = (event) => {
    console.log('WebSocket disconnected at', new Date().toISOString(), 'reason:', event.reason, 'code:', event.code);
    isInitialized = false;
    ws = null;
    setTimeout(initializeWebSocket, 5000);
  };

  ws.onerror = (error) => {
    // Fix: error may be an Event, not always have .message
    console.error('WebSocket error occurred at', new Date().toISOString(), ':', error);
  };
};

// Start WebSocket connection on module load
console.log('Starting WebSocket initialization at', new Date().toISOString());
initializeWebSocket();

// Send config update to backend
export const updateDeviceConfig = (id: string, config: Device['config']) => {
  console.log(`Updating config for device ID: ${id} at`, new Date().toISOString());
  const device = devices.find((d) => d.id === id);
  if (device) {
    device.config = config;
    console.log(`Device ${device.name} config updated at`, new Date().toISOString(), ':', config);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const deviceName = device.name.replace('Analyzer - ', '');
      const devicePath = devicePathMap[deviceName];
      if (devicePath) {
        // Send each config property as a separate message to backend (WDX expects one key at a time)
        Object.entries(config).forEach(([key, value]) => {
          let wdxKey = key;
          if (key === 'addr1') wdxKey = 'addr1';
          else if (key === 'baud1') wdxKey = 'baud1';
          else if (key === 'check1') wdxKey = 'checkDigit 1';
          else if (key === 'stopBit1') wdxKey = 'stopBit1';
          else if (key === 'baud2') wdxKey = 'baud2';
          else if (key === 'check2') wdxKey = 'check2';
          else if (key === 'stopBit2') wdxKey = 'stopBit2';
          // WDX expects a single value, not an object, so send just the value
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'setConfig', path: devicePath, config: { [wdxKey]: value } }));
          }
        });
      } else {
        console.log(`No device path found for device: ${deviceName} at`, new Date().toISOString());
      }
    } else {
      console.log('WebSocket not connected, cannot send config update at', new Date().toISOString());
    }
    notifyListeners();
  } else {
    console.log(`Device with ID ${id} not found for config update at`, new Date().toISOString());
  }
};

export const updateDevicesFromWDX = (wdxDevices: { name: string; config: Device['config'] }[]) => {
  console.log('Updating devices from WDX, incoming devices:', wdxDevices, 'at', new Date().toISOString());
  devices.length = 0;

  wdxDevices.forEach((wdxDevice, index) => {
    const deviceName = wdxDevice.name;
    const id = (index + 1).toString();

    const device: Device = {
      id,
      name: `Analyzer - ${deviceName}`,
      latitude: 41.0 + index * 0.01,
      longitude: 29.0 + index * 0.01,
      voltageRange: '230V',
      status: 'Active',
      config: {
        addr1: wdxDevice.config.addr1 || 1,
        baud1: wdxDevice.config.baud1 || 9600,
        check1: wdxDevice.config.check1 || 0,
        stopBit1: wdxDevice.config.stopBit1 || 0,
        baud2: wdxDevice.config.baud2 || 9600,
        check2: wdxDevice.config.check2 || 0,
        stopBit2: wdxDevice.config.stopBit2 || 0,
      },
    };
    devices.push(device);
  });

  console.log('Devices updated from WDX at', new Date().toISOString(), ':', devices.map(d => ({ id: d.id, name: d.name })));
};

export const updateDeviceFromWDXData = (path: string, value: any) => {
  console.log(`Updating device from WDX data, path: ${path}, value:`, value, 'at', new Date().toISOString());
  const deviceName = path.split('.').pop() || '';
  const device = devices.find(d => d.name === `Analyzer - ${deviceName}`);
  if (device && value) {
    const updatedConfig = { ...device.config };
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === 'number') {
        if (key === 'Addr1') updatedConfig.addr1 = val;
        else if (key === 'Baud1') updatedConfig.baud1 = val;
        else if (key === 'Check Digit 1') updatedConfig.check1 = val;
        else if (key === 'Stop Bit 1') updatedConfig.stopBit1 = val;
        else if (key === 'Baud2') updatedConfig.baud2 = val;
        else if (key === 'Check Digit 2') updatedConfig.check2 = val;
        else if (key === 'Stop Bit 2') updatedConfig.stopBit2 = val;
      }
    });
    device.config = updatedConfig;
    console.log(`Updated device ${device.name} config at`, new Date().toISOString(), ':', updatedConfig);
    notifyListeners();
  } else {
    console.log(`No device found or invalid data for path: ${path} at`, new Date().toISOString());
  }
};