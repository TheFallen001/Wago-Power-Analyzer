// utils/DeviceStore.ts
export type Device = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  voltageRange: string;
  status: string;
  config: {
    addr1: number; // Address (1-247)
    baud1: number; // Baud Rate 1
    check1: number; // Check Digit 1 (0: No check, 1: Odd parity, 2: Parity)
    stopBit1: number; // Stop Bit 1 (0: 1 bit, 1: 1.5 bit, 2: 2 bit)
    baud2: number; // Baud Rate 2
    check2: number; // Check Digit 2
    stopBit2: number; // Stop Bit 2
  };
};

export const devices: Device[] = [
  {
    id: '1',
    name: 'Analyzer - Taksim',
    latitude: 41.0351,
    longitude: 28.9862,
    voltageRange: '220-240V',
    status: 'Active',
    config: {
      addr1: 1,
      baud1: 9600,
      check1: 2, // Parity
      stopBit1: 1, // 1.5 stop bit
      baud2: 57600,
      check2: 2, // Parity
      stopBit2: 1, // 1.5 stop bit
    },
  },
  {
    id: '2',
    name: 'Analyzer - Sultanahmet',
    latitude: 41.0059,
    longitude: 28.9769,
    voltageRange: '230V',
    status: 'Active',
    config: {
      addr1: 2,
      baud1: 4800,
      check1: 1, // Odd parity
      stopBit1: 0, // 1 stop bit
      baud2: 19200,
      check2: 0, // No check
      stopBit2: 2, // 2 stop bit
    },
  },
  {
    id: '3',
    name: 'Analyzer - Beşiktaş',
    latitude: 41.0417,
    longitude: 29.0027,
    voltageRange: '220-240V',
    status: 'Inactive',
    config: {
      addr1: 3,
      baud1: 19200,
      check1: 0, // No check
      stopBit1: 2, // 2 stop bit
      baud2: 38400,
      check2: 1, // Odd parity
      stopBit2: 0, // 1 stop bit
    },
  },
  {
    id: '4',
    name: 'Analyzer - Kadıköy',
    latitude: 40.9915,
    longitude: 29.0246,
    voltageRange: '230V',
    status: 'Active',
    config: {
      addr1: 4,
      baud1: 57600,
      check1: 2, // Parity
      stopBit1: 1, // 1.5 stop bit
      baud2: 9600,
      check2: 2, // Parity
      stopBit2: 1, // 1.5 stop bit
    },
  },
];

export const addDevice = (device: Device) => {
  devices.push(device);
};

export const updateDeviceConfig = (id: string, config: Device['config']) => {
  const device = devices.find((d) => d.id === id);
  if (device) {
    device.config = config;
  }
};