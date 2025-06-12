"use client";
import React, { useState } from "react";

export default function Settings() {
  const [isLightMode, setIsLightMode] = useState(true);

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <div style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-md">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold text-center mb-6">Settings</h1>
        <div className="flex flex-col items-center mt-10">
          <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <span style={{ color: '#22223B' }} className="text-3xl"></span>
          </div>
          <div style={{ color: '#22223B' }} className="text-lg font-bold mb-6">User Profile</div>
        </div>
        <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="flex items-center justify-between mt-10 px-5 py-3 rounded-2xl">
          <span style={{ color: '#22223B' }} className="font-semibold">{isLightMode ? "Light Mode" : "Dark Mode"}</span>
          <button
            style={{ background: isLightMode ? '#0057B8' : '#6B7280' }}
            className={`w-12 h-6 flex items-center rounded-full p-1`}
            onClick={() => setIsLightMode(m => !m)}
            aria-label="Toggle light/dark mode"
          >
            <span
              style={{ background: '#fff' }}
              className={`h-4 w-4 rounded-full shadow transform transition-transform ${isLightMode ? 'translate-x-6' : ''}`}
            />
          </button>
        </div>
        <a href="/logs" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#22223B' }} className="block mt-5 px-5 py-3 rounded-2xl text-center font-semibold hover:bg-[#E5E7EB] transition">Logs</a>
        <button
          style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#22223B' }}
          className="block w-full mt-5 px-5 py-3 rounded-2xl font-semibold hover:bg-[#E5E7EB] transition"
          onClick={() => alert("Navigate to About Us")}
        >
          About Us
        </button>
      </div>
    </div>
  );
}