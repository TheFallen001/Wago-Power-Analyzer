// Web version of ConfigureScreen with custom colors and device selection
"use client";
import React, { useEffect, useState } from "react";
import { updateDeviceConfig, subscribeToDeviceUpdates, devices } from "../utils/VirtualDeviceStore";


const BAUD_OPTIONS = ["1200", "2400", "4800", "9600", "19200", "38400", "57600"];
const CHECK_OPTIONS = [
  { label: "0 No check", value: "0" },
  { label: "1 Odd parity", value: "1" },
  { label: "2 Parity", value: "2" },
];
const STOPBIT_OPTIONS = [
  { label: "1 stop bit", value: "0" },
  { label: "1.5 stop bit", value: "1" },
  { label: "2 stop bit", value: "2" },
];

export default function Configure() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selected, setSelected] = useState<Device | null>(null);
  const [form, setForm] = useState({
    addr1: "",
    baud1: "",
    check1: "",
    stopBit1: "",
    baud2: "",
    check2: "",
    stopBit2: "",
  });
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const unsub = subscribeToDeviceUpdates((devs) => {
      setDevices(devs);
      // Only update device and form if device list changes (add/remove), not on config update
      const selectedDevice =
        devs.find((d) => d.name === selected?.name) ||
        devs.find((d) => d.id === selected?.id) ||
        devs[0];
      // Only update if device is not set or deviceId changed
      if (!selected || (selectedDevice && selected.name !== selectedDevice.name)) {
        setSelected(selectedDevice);
        updateForm(selectedDevice);
      }
      // Do NOT update config fields if config changes from the server
    });
    return () => unsub();
  }, []);

  const updateForm = (dev: Device | null) => {
    if (dev) {
      setForm({
        addr1: dev.config.addr1.toString(),
        baud1: dev.config.baud1.toString(),
        check1: dev.config.check1.toString(),
        stopBit1: dev.config.stopBit1.toString(),
        baud2: dev.config.baud2.toString(),
        check2: dev.config.check2.toString(),
        stopBit2: dev.config.stopBit2.toString(),
      });
    } else {
      setForm({
        addr1: "",
        baud1: "",
        check1: "",
        stopBit1: "",
        baud2: "",
        check2: "",
        stopBit2: "",
      });
    }
  };

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dev = devices.find((d) => d.name === e.target.value);
    setSelected(dev || null);
    updateForm(dev || null);
    setStatus("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setStatus("Device not found.");
      return;
    }
    const newConfig = {
      addr1: parseInt(form.addr1, 10),
      baud1: parseInt(form.baud1, 10),
      check1: parseInt(form.check1, 10),
      stopBit1: parseInt(form.stopBit1, 10),
      baud2: parseInt(form.baud2, 10),
      check2: parseInt(form.check2, 10),
      stopBit2: parseInt(form.stopBit2, 10),
    };
    if (isNaN(newConfig.addr1) || newConfig.addr1 < 1 || newConfig.addr1 > 247) {
      setStatus("Address must be between 1 and 247.");
      return;
    }
    updateDeviceConfig(selected.name, newConfig);
    setStatus("Configuration applied successfully!");
  };

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
            <input type="number" name="addr1" min={1} max={247} className="w-full rounded px-3 py-2 text-lg" style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }} value={form.addr1} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Baud Rate 1 (Baud1)</label>
            <select name="baud1" className="w-full rounded px-3 py-2 text-lg" style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }} value={form.baud1} onChange={handleChange} required>
              {BAUD_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Check Digit 1 (Check1)</label>
            <select name="check1" className="w-full rounded px-3 py-2 text-lg" style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }} value={form.check1} onChange={handleChange} required>
              {CHECK_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Stop Bit (StopBit1)</label>
            <select name="stopBit1" className="w-full rounded px-3 py-2 text-lg" style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }} value={form.stopBit1} onChange={handleChange} required>
              {STOPBIT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Baud Rate 2 (Baud2)</label>
            <select name="baud2" className="w-full rounded px-3 py-2 text-lg" style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }} value={form.baud2} onChange={handleChange} required>
              {BAUD_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Check Digit 2 (Check2)</label>
            <select name="check2" className="w-full rounded px-3 py-2 text-lg" style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }} value={form.check2} onChange={handleChange} required>
              {CHECK_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium" style={{ color: '#28a745' }}>Stop Bit (StopBit2)</label>
            <select name="stopBit2" className="w-full rounded px-3 py-2 text-lg" style={{ background: '#F3F4F6', border: '1px solid #28a745', color: '#22223B' }} value={form.stopBit2} onChange={handleChange} required>
              {STOPBIT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" style={{ background: '#28a745', color: '#fff', fontWeight: 700, fontSize: '1.2rem' }} className="w-full py-3 rounded hover:bg-[#FFB800] transition mb-2">
          Apply Configuration
        </button>
        {status && (
          <div className="mt-4 text-center font-semibold" style={{ color: status.includes('success') ? '#28a745' : '#d90429' }}>{status}</div>
        )}
      </form>
    </div>
  );
}
