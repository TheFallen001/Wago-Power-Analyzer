// Web version of PAScreen (Power Analyzers List) using Tailwind CSS
"use client";
import React from "react";

const devices = [
  { id: "1", name: "Device 1", address: "Some Address", voltageRange: "220-240V", status: "Active" },
  { id: "2", name: "Device 2", address: "Another Address", voltageRange: "220-240V", status: "Inactive" },
];

export default function PAScreen() {
  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <div style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-2xl">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold text-center mb-6">Power Analyzers</h1>
        <div className="space-y-4">
          {devices.map(device => (
            <div key={device.id} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="p-4 rounded">
              <div style={{ color: '#22223B' }} className="text-lg font-bold mb-1">{device.name}</div>
              <div style={{ color: '#22223B' }} className="">Address: {device.address}</div>
              <div style={{ color: '#22223B' }} className="">Voltage Range: {device.voltageRange}</div>
              <div style={{ color: '#22223B' }} className="">Status: {device.status}</div>
              <div className="flex gap-2 mt-2">
                <a href="/device-detail" style={{ background: '#0057B8', color: '#fff' }} className="py-2 px-4 rounded hover:bg-[#FFB800] transition">View Details</a>
                <a href="/configure" style={{ background: '#0057B8', color: '#fff' }} className="py-2 px-4 rounded hover:bg-[#FFB800] transition">Configure</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
