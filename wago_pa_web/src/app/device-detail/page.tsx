// Web version of DeviceDetailScreen using Tailwind CSS
"use client";
import React, { useState, useEffect } from "react";

const mockDevice = {
  id: "1",
  name: "Device 1",
  latitude: 41.0,
  longitude: 29.0,
  address: "Some Address",
};

export default function DeviceDetail() {
  const [address, setAddress] = useState(mockDevice.address);
  const [isSaving, setIsSaving] = useState(false);
  const [voltageData, setVoltageData] = useState<number[]>([220, 221, 219, 222, 218, 223]);
  const [consumptionData, setConsumptionData] = useState<number[]>([10, 12, 11, 13, 12, 14]);

  useEffect(() => {
    // Simulate chart data update every 2s
    const interval = setInterval(() => {
      setVoltageData(data => [...data.slice(1), 218 + Math.floor(Math.random() * 7)]);
      setConsumptionData(data => [...data.slice(1), 10 + Math.floor(Math.random() * 5)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Address saved!");
    }, 1000);
  };

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <div style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-2xl">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold text-center mb-6">Device Detail</h1>
        <form onSubmit={handleSave} className="mb-6">
          <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Address</label>
          <input type="text" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2 mb-2" value={address} onChange={e => setAddress(e.target.value)} />
          <button type="submit" style={{ background: '#0057B8', color: '#fff' }} className="py-2 px-4 rounded hover:bg-[#FFB800] transition" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Address"}
          </button>
        </form>
        <div className="mb-6">
          <h2 style={{ color: '#22223B' }} className="font-semibold mb-2">Voltage Chart</h2>
          <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="flex gap-1 items-end h-24 rounded p-2">
            {voltageData.map((v, i) => (
              <div
                key={i}
                style={{ background: '#0057B8', width: '1.5rem', height: `${(v-215)*6}px` }}
                title={v+"V"}
              ></div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h2 style={{ color: '#22223B' }} className="font-semibold mb-2">Current Chart</h2>
          <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="flex gap-1 items-end h-24 rounded p-2">
            {consumptionData.map((c, i) => (
              <div
                key={i}
                style={{ background: '#FFB800', width: '1.5rem', height: `${(c-9)*12}px` }}
                title={c+"A"}
              ></div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h2 style={{ color: '#fff', background: '#22223B', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }} className="font-semibold mb-2">Location</h2>
          <div style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }} className="w-full h-48 rounded flex items-center justify-center">
            Map Placeholder ({mockDevice.latitude}, {mockDevice.longitude})
          </div>
        </div>
      </div>
    </div>
  );
}
