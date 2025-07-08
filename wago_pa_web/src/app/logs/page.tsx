// Web version of LogsScreen using Tailwind CSS
"use client";
import React, { useState } from "react";
import DeviceDropdown from "../components/DeviceDropdown";
import { ModbusDevices,getLogs } from "../utils/ModbusDeviceStore";

// TODO: Implement Modbus logs fetching if needed


export interface LogItem {
  level: string;
  date: {
    timestamp: number;
    date: string;
  };
  channel: string;
  title: string;
  messsage: string;
  instanceUuid: string;
}



function LogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const devices = ModbusDevices;

  // Placeholder: No logs for Modbus devices yet
  const handleConfirm = () => {
    console.log(selectedDevice)
    setLogs([]);
    console.log("Getting Logs...");

    getLogs(selectedDevice, (rawLogs) => {
      try {
        const parsed = JSON.parse(rawLogs);
        setLogs(parsed);
      } catch (e) {
        console.error("Parse error:", e);
      }
     
    });


  };

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <div style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-2xl">
        <h1 style={{ color: '#28a745' }} className="text-2xl font-bold text-center mb-6">Logs</h1>
        <div className="mb-4">
          <DeviceDropdown
            devices={devices}
            selectedDevice={selectedDevice}
            onChange={(selDev) => {
              const dev = devices.find((d) => d.id === selDev);
              setSelectedDevice(dev?.name ?? "");
            }}
          />
        </div>
        <button
          style={{ background: '#28a745', color: '#fff' }}
          className="w-full py-2 rounded hover:bg-[#FFB800] transition mb-6"
          onClick={handleConfirm}
        >
          Confirm
        </button>
        <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="rounded-2xl h-60 overflow-y-auto p-4">
          {logs.length === 0 ? (
            <div style={{ color: '#6B7280' }} className="">No logs yet.</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} style={{ color: '#22223B' }} className="mb-2 text-sm">
                <div><strong>{log.date.date}</strong> [{log.level}] ({log.channel})</div>
                <div>{log.title}: {log.messsage}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default LogsPage;
