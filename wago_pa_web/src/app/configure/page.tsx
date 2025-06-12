// Web version of ConfigureScreen using Tailwind CSS
"use client";
import React, { useState } from "react";

const mockDevice = {
  id: "1",
  name: "Device 1",
  config: {
    addr1: 1,
    baud1: 9600,
    check1: 2,
    stopBit1: 1,
    baud2: 57600,
    check2: 2,
    stopBit2: 1,
  },
};

export default function Configure() {
  const [addr1, setAddr1] = useState(mockDevice.config.addr1.toString());
  const [baud1, setBaud1] = useState(mockDevice.config.baud1.toString());
  const [check1, setCheck1] = useState(mockDevice.config.check1.toString());
  const [stopBit1, setStopBit1] = useState(mockDevice.config.stopBit1.toString());
  const [baud2, setBaud2] = useState(mockDevice.config.baud2.toString());
  const [check2, setCheck2] = useState(mockDevice.config.check2.toString());
  const [stopBit2, setStopBit2] = useState(mockDevice.config.stopBit2.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Configuration saved!");
    }, 1000);
  };

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <form onSubmit={handleSave} style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-lg">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold text-center mb-6">Configure Device</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Addr1</label>
            <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={addr1} onChange={e => setAddr1(e.target.value)} required />
          </div>
          <div>
            <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Baud1</label>
            <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={baud1} onChange={e => setBaud1(e.target.value)} required />
          </div>
          <div>
            <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Check1</label>
            <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={check1} onChange={e => setCheck1(e.target.value)} required />
          </div>
          <div>
            <label style={{ color: '#22223B' }} className="block mb-1 font-medium">StopBit1</label>
            <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={stopBit1} onChange={e => setStopBit1(e.target.value)} required />
          </div>
          <div>
            <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Baud2</label>
            <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={baud2} onChange={e => setBaud2(e.target.value)} required />
          </div>
          <div>
            <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Check2</label>
            <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={check2} onChange={e => setCheck2(e.target.value)} required />
          </div>
          <div>
            <label style={{ color: '#22223B' }} className="block mb-1 font-medium">StopBit2</label>
            <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={stopBit2} onChange={e => setStopBit2(e.target.value)} required />
          </div>
        </div>
        <button type="submit" style={{ background: '#0057B8', color: '#fff' }} className="w-full py-2 rounded hover:bg-[#FFB800] transition" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Configuration"}
        </button>
      </form>
    </div>
  );
}
