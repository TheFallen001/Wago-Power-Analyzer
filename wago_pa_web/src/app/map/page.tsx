// Web version of MapScreen using Tailwind CSS
"use client";
import React from "react";

const devices = [
  { id: "1", name: "Device 1", latitude: 41.0082, longitude: 28.9784 },
  { id: "2", name: "Device 2", latitude: 41.02, longitude: 28.99 },
];

export default function MapScreen() {
  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <div style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-3xl">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold text-center mb-6">Device Map</h1>
        <div style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }} className="w-full h-96 rounded flex items-center justify-center mb-4">
          Map Placeholder (Istanbul)
        </div>
        <div className="space-y-2">
          {devices.map(device => (
            <div key={device.id} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="flex justify-between items-center p-3 rounded">
              <div>
                <div style={{ color: '#22223B' }} className="font-semibold">{device.name}</div>
                <div style={{ color: '#6B7280' }} className="text-xs">Lat: {device.latitude}, Lng: {device.longitude}</div>
              </div>
              <a href="/device-detail" style={{ background: '#0057B8', color: '#fff' }} className="px-3 py-1 rounded hover:bg-[#FFB800] transition">Details</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
