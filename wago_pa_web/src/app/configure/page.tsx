
"use client";
import React, { useEffect, useState } from "react";
import { updateDeviceConfig, subscribeToDeviceUpdates, ModbusDevice, ModbusDevices } from "../utils/ModbusDeviceStore";

const BAUD_OPTIONS = ["1200", "2400", "4800", "9600", "19200", "38400", "57600"];
const CHECK_OPTIONS = [
  { label: "0 No check", value: "0" },
  { label: "1 Odd parity", value: "1" },
  { label: "2 Parity", value: "2" },
];

export default function Configure() {
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [selected, setSelected] = useState<ModbusDevice | null>(null);
  const [form, setForm] = useState({
    Addr1: "",
    Baud1: "",
    Check1: "",
    Baud2: "",
    Check2: "",
    "645Addr": "",
    Language: "",
  });
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    console.log("Configure: Initializing with ModbusDevices:", ModbusDevices);
    // Initialize with current devices and subscribe to updates
    const initialDevices = [...(ModbusDevices || [])]; // Fallback to empty array if undefined
    console.log("Configure: Initial devices set:", initialDevices);
    setDevices(initialDevices);
    setSelected(initialDevices[0] || null);
    updateForm(initialDevices[0] || null);

    const unsub = subscribeToDeviceUpdates((devs) => {
      console.log("Configure: Device update received from subscribeToDeviceUpdates, new devices:", devs);
      setDevices([...devs]); // Ensure reactivity by creating a new array
      const selectedDevice =
        devs.find((d) => d.name === selected?.name) ||
        devs.find((d) => d.id === selected?.id) ||
        devs[0];
      console.log("Configure: Selected device after update:", selectedDevice);
      if (!selected || (selectedDevice && selected.name !== selectedDevice.name)) {
        setSelected(selectedDevice || null);
        updateForm(selectedDevice || null);
      }
    });
    return () => {
      console.log("Configure: Cleanup - unsubscribing from device updates");
      unsub();
    };
  }, []);

  const updateForm = (dev: ModbusDevice | null) => {
    console.log("Configure: Updating form with device:", dev);
    if (dev) {
      setForm({
        Addr1: dev.config.Addr1?.toString() || "",
        Baud1: dev.config.Baud1?.toString() || "",
        Check1: dev.config.Check1?.toString() || "",
        Baud2: dev.config.Baud2?.toString() || "",
        Check2: dev.config.Check2?.toString() || "",
        "645Addr": dev.config["645Addr"]?.toString() || "",
        Language: dev.config.Language?.toString() || "",
      });
      console.log("Configure: Form updated to:", {
        Addr1: dev.config.Addr1?.toString() || "",
        Baud1: dev.config.Baud1?.toString() || "",
        Check1: dev.config.Check1?.toString() || "",
        Baud2: dev.config.Baud2?.toString() || "",
        Check2: dev.config.Check2?.toString() || "",
        "645Addr": dev.config["645Addr"]?.toString() || "",
        Language: dev.config.Language?.toString() || "",
      });
    } else {
      setForm({
        Addr1: "",
        Baud1: "",
        Check1: "",
        Baud2: "",
        Check2: "",
        "645Addr": "",
        Language: "",
      });
      console.log("Configure: Form reset to empty");
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Configure: Device selection changed to:", e.target.value);
    const dev = devices.find((d) => d.name === e.target.value);
    setSelected(dev || null);
    updateForm(dev || null);
    setStatus("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    console.log("Configure: Form field changed, name:", e.target.name, "value:", e.target.value);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setStatus("Device not found.");
      return;
    }
    const newConfig = {
      Addr1: parseInt(form.Addr1, 10),
      Baud1: parseInt(form.Baud1, 10),
      Check1: parseInt(form.Check1, 10),
      Baud2: parseInt(form.Baud2, 10),
      Check2: parseInt(form.Check2, 10),
      "645Addr": parseInt(form["645Addr"], 10),
      Language: parseInt(form.Language, 10),
    };
    const deviceName = selected.name.replace("Analyzer - ", "");
    updateDeviceConfig(deviceName, newConfig);
    setStatus("Configuration applied successfully!");
  };
  useEffect(() => {
    console.log("Configure: Selected device changed to:", selected);
    if (selected) {
      updateForm(selected);
    }
  }, [selected]);
  
  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <form onSubmit={handleApply} style={{ background: '#fff', border: '2px solid #28a745' }} className="p-8 rounded shadow-md w-full max-w-lg">
        <h1 style={{ color: '#28a745' }} className="text-3xl font-bold text-center mb-8">Power Analyzer Configuration</h1>
        <div className="mb-6">
          <label className="block font-semibold mb-2" style={{ color: '#28a745' }}>Device</label>
          <select
            className="w-full border rounded px-3 py-2 text-lg"
            style={{ borderColor: '#28a745', color: '#22223B', background: '#F3F4F6' }}
            value={selected?.name || ""}
            onChange={handleDeviceChange}
            disabled={devices.length === 0}
          >
            {devices.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Address (Addr1)</label>
            <input
              type="number"
              name="Addr1"
              min={1}
              max={247}
              className="w-full rounded px-3 py-2 text-lg"
              style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }}
              value={form.Addr1}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>645 Address (645Addr)</label>
            <input
              type="number"
              name="645Addr"
              className="w-full rounded px-3 py-2 text-lg"
              style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }}
              value={form["645Addr"]}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Baud Rate 1 (Baud1)</label>
            <select
              name="Baud1"
              className="w-full rounded px-3 py-2 text-lg"
              style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }}
              value={form.Baud1}
              onChange={handleChange}
              required
            >
              {BAUD_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Baud Rate 2 (Baud2)</label>
            <select
              name="Baud2"
              className="w-full rounded px-3 py-2 text-lg"
              style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }}
              value={form.Baud2}
              onChange={handleChange}
              required
            >
              {BAUD_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Check Digit 1 (Check1)</label>
            <select
              name="Check1"
              className="w-full rounded px-3 py-2 text-lg"
              style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }}
              value={form.Check1}
              onChange={handleChange}
              required
            >
              {CHECK_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Check Digit 2 (Check2)</label>
            <select
              name="Check2"
              className="w-full rounded px-3 py-2 text-lg"
              style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }}
              value={form.Check2}
              onChange={handleChange}
              required
            >
              {CHECK_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Language</label>
            <input
              type="number"
              name="Language"
              className="w-full rounded px-3 py-2 text-lg"
              style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }}
              value={form.Language}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          style={{ background: '#28a745', color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}
          className="w-full py-3 rounded hover:bg-[#FFB800] transition mb-2"
        >
          Apply Configuration
        </button>
        {status && (
          <div className="mt-4 text-center font-semibold" style={{ color: status.includes("success") ? "#28a745" : "#d90429" }}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}