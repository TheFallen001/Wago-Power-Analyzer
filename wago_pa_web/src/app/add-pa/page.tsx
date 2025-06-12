// Web version of AddPA screen using Tailwind CSS
"use client";
import React, { useState } from "react";

export default function AddPA() {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [status, setStatus] = useState("Active");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !latitude || !longitude) {
      alert("Please fill in all required fields (Name, Latitude, Longitude).");
      return;
    }
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      alert("Device added!");
      setName("");
      setLatitude("");
      setLongitude("");
    }, 1000);
  };

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleAddDevice} style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-md">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold mb-6 text-center">Add Device</h1>
        <div className="mb-4">
          <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Name</label>
          <input type="text" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Latitude</label>
          <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={latitude} onChange={e => setLatitude(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Longitude</label>
          <input type="number" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-full rounded px-3 py-2" value={longitude} onChange={e => setLongitude(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label style={{ color: '#22223B' }} className="block mb-1 font-medium">Status</label>
          <select style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#22223B' }} className="w-full rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" style={{ background: '#0057B8', color: '#fff' }} className="w-full py-2 rounded hover:bg-[#FFB800] transition" disabled={isSaving}>
          {isSaving ? "Saving..." : "Add Device"}
        </button>
      </form>
    </div>
  );
}
