"use client";
import React, { useEffect, useState } from "react";
import { updateDeviceConfig, subscribeToDeviceUpdates, Device } from "./utils/DeviceStore";

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

export default function ConfigurePage() {
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
      if (!selected && devs.length > 0) {
        setSelected(devs[0]);
        updateForm(devs[0]);
      }
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
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Power Analyzer Configuration</h1>
      <form onSubmit={handleApply}>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Device</label>
          <select
            className="w-full border rounded px-3 py-2"
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
        <div className="mb-4">
          <label className="block font-semibold mb-1">Address (Addr1)</label>
          <input
            type="number"
            name="addr1"
            min={1}
            max={247}
            className="w-full border rounded px-3 py-2"
            value={form.addr1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Baud Rate 1 (Baud1)</label>
          <select
            name="baud1"
            className="w-full border rounded px-3 py-2"
            value={form.baud1}
            onChange={handleChange}
            required
          >
            {BAUD_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Check Digit 1 (Check1)</label>
          <select
            name="check1"
            className="w-full border rounded px-3 py-2"
            value={form.check1}
            onChange={handleChange}
            required
          >
            {CHECK_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Stop Bit (StopBit1)</label>
          <select
            name="stopBit1"
            className="w-full border rounded px-3 py-2"
            value={form.stopBit1}
            onChange={handleChange}
            required
          >
            {STOPBIT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Baud Rate 2 (Baud2)</label>
          <select
            name="baud2"
            className="w-full border rounded px-3 py-2"
            value={form.baud2}
            onChange={handleChange}
            required
          >
            {BAUD_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Check Digit 2 (Check2)</label>
          <select
            name="check2"
            className="w-full border rounded px-3 py-2"
            value={form.check2}
            onChange={handleChange}
            required
          >
            {CHECK_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Stop Bit (StopBit2)</label>
          <select
            name="stopBit2"
            className="w-full border rounded px-3 py-2"
            value={form.stopBit2}
            onChange={handleChange}
            required
          >
            {STOPBIT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded font-semibold mt-2"
        >
          Apply Configuration
        </button>
        {status && (
          <div className="mt-4 text-center text-red-600 font-semibold">{status}</div>
        )}
      </form>
    </div>
  );
}
