// Web version of DeviceDetailScreen using Tailwind CSS and Chart.js
"use client";
import React from "react";
// Define Alarm type locally since it's not exported from DeviceStore
type Alarm = {
  id: string;
  device: string;
  message: string;
  timestamp: string;
  type: string;
  value: number;
  index: number;
};

declare global {
  interface Window {
    _webAlarmHistory?: Alarm[];
    _webAddAlarm?: (alarm: Alarm) => void;
  }
}

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { useDevices } from '../utils/VirtualDeviceStore';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ScriptableContext, PointStyle } from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

// --- Alarm state for web ---
function useAlarmHistory() {
  const [alarmHistory, setAlarmHistory] = React.useState<Alarm[]>([]);
  React.useEffect(() => {
    // Listen for alarms (simulate DeviceStore alarmListeners)
    if (typeof window !== 'undefined') {
      if (!window._webAlarmHistory) window._webAlarmHistory = [];
      window._webAddAlarm = (alarm: Alarm) => {
        (window._webAlarmHistory ??= []).unshift(alarm);
        setAlarmHistory([...(window._webAlarmHistory ?? [])]);
      };
    }
  }, []);
  return alarmHistory;
}

export default function DeviceDetail() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get('id');
  const { devices } = useDevices();
  const device = devices.find(d => d.id === deviceId);
  const router = useRouter();

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2 text-[#28a745]">Device Not Found</h2>
          <p className="mb-4">No device found with ID: {deviceId}</p>
          <a href="/devices" className="text-[#28a745] underline">Back to Devices</a>
        </div>
      </div>
    );
  }

  // Use live chart data from DeviceStore
  const voltageData = voltageChartDataMap[device.id] || [];
  const currentData = currentChartDataMap[device.id] || [];
  const labels = Array.from({ length: voltageData.length }, (_, i) => new Date(Date.now() - (voltageData.length - 1 - i) * 1000));

  // Metrics
  const voltageLevel = voltageData.length ? voltageData[voltageData.length - 1] : 0;
  const currentLevel = currentData.length ? currentData[currentData.length - 1] : 0;

  // Set up auto-update for live data
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Custom dot rendering for alarm points ---
  function pointStyleRenderer(ctx: ScriptableContext<"line">): PointStyle {
    return "circle";
  }

  function pointRadiusRenderer(ctx: ScriptableContext<"line">) {
    const { dataset, parsed } = ctx;
    if (dataset.label === "Voltage (V)") {
      const v = parsed.y;
      if (v < VOLTAGE_ALARM_RANGE.min || v > VOLTAGE_ALARM_RANGE.max) {
        return 7;
      }
    }
    if (dataset.label === "Current (A)") {
      const c = parsed.y;
      if (c < CURRENT_ALARM_RANGE.min || c > CURRENT_ALARM_RANGE.max) {
        return 7;
      }
    }
    return 3;
  }

  function pointBackgroundColorRenderer(ctx: ScriptableContext<"line">) {
    const { dataset, parsed } = ctx;
    if (dataset.label === "Voltage (V)") {
      const v = parsed.y;
      if (v < VOLTAGE_ALARM_RANGE.min || v > VOLTAGE_ALARM_RANGE.max) {
        return "#dc2626";
      }
    }
    if (dataset.label === "Current (A)") {
      const c = parsed.y;
      if (c < CURRENT_ALARM_RANGE.min || c > CURRENT_ALARM_RANGE.max) {
        return "#dc2626";
      }
    }
    return "#fff";
  }

  function pointBorderColorRenderer(ctx: ScriptableContext<"line">) {
    const { dataset, parsed } = ctx;
    if (dataset.label === "Voltage (V)") {
      const v = parsed.y;
      if (v < VOLTAGE_ALARM_RANGE.min || v > VOLTAGE_ALARM_RANGE.max) {
        return "#dc2626";
      }
      return "#005792";
    }
    if (dataset.label === "Current (A)") {
      const c = parsed.y;
      if (c < CURRENT_ALARM_RANGE.min || c > CURRENT_ALARM_RANGE.max) {
        return "#dc2626";
      }
      return "#f57c00";
    }
    return "#fff";
  }

  function pointBorderWidthRenderer(ctx: ScriptableContext<"line">) {
    const { dataset, parsed } = ctx;
    if (dataset.label === "Voltage (V)") {
      const v = parsed.y;
      if (v < VOLTAGE_ALARM_RANGE.min || v > VOLTAGE_ALARM_RANGE.max) {
        return 2;
      }
      return 1;
    }
    if (dataset.label === "Current (A)") {
      const c = parsed.y;
      if (c < CURRENT_ALARM_RANGE.min || c > CURRENT_ALARM_RANGE.max) {
        return 2;
      }
      return 1;
    }
    return 1;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center p-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#28a745]">
          Device Detail: <span className="text-black">{device.name}</span>
        </h1>
        <section className="flex flex-wrap gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-black mb-1">Voltage</h3>
            <p className="text-xl font-bold text-gray-700" data-testid="voltageLevel">{voltageLevel} V</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-black mb-1">Current</h3>
            <p className="text-xl font-bold text-gray-700" data-testid="currentLevel">{currentLevel} A</p>
          </div>
        </section>
        <h2 className="text-xl text-black font-semibold mb-2 mt-4">Live Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 charts-grid">
          <div className="bg-white p-4 rounded shadow chart-container">
            <h3 className="font-semibold text-gray-700 mb-2 ">Voltage (V)</h3>
            <Line
              data={{
                labels,
                datasets: [{
                  label: 'Voltage (V)',
                  data: voltageData,
                  borderColor: '#005792',
                  backgroundColor: 'rgba(0,87,146,0.1)',
                  fill: false,
                  pointStyle: pointStyleRenderer,
                  pointRadius: pointRadiusRenderer,
                  pointBackgroundColor: pointBackgroundColorRenderer,
                  pointBorderColor: pointBorderColorRenderer,
                  pointBorderWidth: pointBorderWidthRenderer,
                }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: false } },
                scales: {
                  x: { type: 'time', time: { unit: 'second' }, grid: { display: false } },
                  y: { min: 210, max: 240, beginAtZero: false, grid: { display: true } },
                },
                elements: { point: { radius: 0 }, line: { tension: 0.3 } },
                animation: false,
              }}
            />
          </div>
          <div className="bg-white p-4 rounded shadow chart-container">
            <h3 className="font-semibold text-gray-700 mb-2">Current (A)</h3>
            <Line
              data={{
                labels,
                datasets: [{
                  label: 'Current (A)',
                  data: currentData,
                  borderColor: '#f57c00',
                  backgroundColor: 'rgba(245,124,0,0.1)',
                  fill: false,
                  pointStyle: pointStyleRenderer,
                  pointRadius: pointRadiusRenderer,
                  pointBackgroundColor: pointBackgroundColorRenderer,
                  pointBorderColor: pointBorderColorRenderer,
                  pointBorderWidth: pointBorderWidthRenderer,
                }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: false } },
                scales: {
                  x: { type: 'time', time: { unit: 'second' }, grid: { display: false } },
                  y: { min: 0, max: 2, beginAtZero: true, grid: { display: true } },
                },
                elements: { point: { radius: 0 }, line: { tension: 0.3 } },
                animation: false,
              }}
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center button-group mt-6">
          <button
            className="px-6 py-2 rounded bg-[#28a745] text-white hover:bg-[#6ec800] transition"
            onClick={() => router.push(`/configure?id=${encodeURIComponent(device.name)}`)}
          >
            Go to Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
