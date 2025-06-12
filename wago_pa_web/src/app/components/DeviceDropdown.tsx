// Web version of DeviceDropdown using HTML <select>
import React from "react";

export interface Device {
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
}

interface DropDownMenuProps {
  devices: Device[];
  selectedDevice: string | null;
  onChange: (value: string) => void;
}

export default function DeviceDropdown({ devices, selectedDevice, onChange }: DropDownMenuProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-text">Select Device:</label>
      <select
        className="w-full border border-border rounded px-3 py-2 bg-surface"
        value={selectedDevice || ""}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select a device...</option>
        {devices.map(device => (
          <option key={device.id} value={device.id}>{device.name}</option>
        ))}
      </select>
    </div>
  );
}
