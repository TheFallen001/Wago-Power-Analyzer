// Web version of DeviceDetailScreen using Tailwind CSS and Chart.js
"use client";
import React from "react";
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
import { useDevices, voltageChartDataMap, currentChartDataMap } from '../utils/DeviceStore';
import { useSearchParams } from 'next/navigation';

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

export default function DeviceDetail() {
  const searchParams = useSearchParams();
  const deviceId = searchParams.get('id');
  const { devices } = useDevices();
  const device = devices.find(d => d.id === deviceId);

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2 text-[#0057B8]">Device Not Found</h2>
          <p className="mb-4">No device found with ID: {deviceId}</p>
          <a href="/devices" className="text-[#0057B8] underline">Back to Devices</a>
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

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center p-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#0057B8]">
          Device Detail: <span className="text-black">{device.name}</span>
        </h1>
        <section className="flex flex-wrap gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-gray-700 mb-1">Voltage</h3>
            <p className="text-xl font-bold" data-testid="voltageLevel">{voltageLevel} V</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-gray-700 mb-1">Current</h3>
            <p className="text-xl font-bold" data-testid="currentLevel">{currentLevel} A</p>
          </div>
        </section>
        <h2 className="text-xl font-semibold mb-2 mt-4">Live Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 charts-grid">
          <div className="bg-white p-4 rounded shadow chart-container">
            <h3 className="font-semibold mb-2">Voltage (V)</h3>
            <Line
              data={{
                labels,
                datasets: [{
                  label: 'Voltage (V)',
                  data: voltageData,
                  borderColor: '#005792',
                  backgroundColor: 'rgba(0,87,146,0.1)',
                  fill: false,
                }],
              }}
              // Inline minimal options for live chart
              options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: false } },
                scales: {
                  x: { type: 'time', time: { unit: 'second' }, grid: { display: false } },
                  y: { beginAtZero: true, grid: { display: true } },
                },
                elements: { point: { radius: 0 }, line: { tension: 0.3 } },
                animation: false,
              }}
            />
          </div>
          <div className="bg-white p-4 rounded shadow chart-container">
            <h3 className="font-semibold mb-2">Current (A)</h3>
            <Line
              data={{
                labels,
                datasets: [{
                  label: 'Current (A)',
                  data: currentData,
                  borderColor: '#f57c00',
                  backgroundColor: 'rgba(245,124,0,0.1)',
                  fill: false,
                }],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false }, title: { display: false } },
                scales: {
                  x: { type: 'time', time: { unit: 'second' }, grid: { display: false } },
                  y: { beginAtZero: true, grid: { display: true } },
                },
                elements: { point: { radius: 0 }, line: { tension: 0.3 } },
                animation: false,
              }}
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center button-group mt-6">
          <button
            className="px-6 py-2 rounded bg-[#005792] text-white hover:bg-[#6ec800] transition"
            onClick={() => alert('Go to Configuration (not implemented)')}
          >
            Go to Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
