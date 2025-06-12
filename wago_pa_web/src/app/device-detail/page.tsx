// Web version of DeviceDetailScreen using Tailwind CSS and Chart.js
"use client";
import React, { useState, useEffect, useRef } from "react";
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

const timeRanges = [
  { value: "live", label: "Live View" },
  { value: "lastHour", label: "Last Hour" },
  { value: "lastDay", label: "Last 24 Hours" },
  { value: "lastWeek", label: "Last 7 Days" },
  { value: "lastMonth", label: "Last 30 Days" },
];

const rangeToMinutes = {
  lastHour: 60,
  lastDay: 1440,
  lastWeek: 10080,
  lastMonth: 43200,
};

type Mode = "live" | keyof typeof rangeToMinutes;

function generateHistoricalData(minutes: number) {
  const arr = [];
  const now = new Date();
  for (let i = minutes; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000);
    arr.push({
      timestamp: t,
      power: +(Math.random() * 50 + 10).toFixed(2),
      voltage: +(220 + Math.random() * 10).toFixed(1),
      current: +(Math.random() * 80 + 10).toFixed(1),
      pf: +(Math.random() * 0.5 + 0.5).toFixed(2),
    });
  }
  return arr;
}
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
  // Simulate power and pf for now
  const powerData = voltageData.map((v, i) => Number((v * (currentData[i] || 1) / 1000).toFixed(2)));
  const pfData = currentData.map(() => Number((Math.random() * 0.5 + 0.5).toFixed(2)));
  const labels = Array.from({ length: voltageData.length }, (_, i) => new Date(Date.now() - (voltageData.length - 1 - i) * 1000));

  // Metrics
  const totalPower = powerData.length ? powerData[powerData.length - 1] : 0;
  const voltageLevels = voltageData.length ? voltageData[voltageData.length - 1] : 0;
  const powerFactor = pfData.length ? pfData[pfData.length - 1] : 0;
  const peakDemand = powerData.length ? Math.max(...powerData) : 0;
  const cost = powerData.reduce((sum, d) => sum + d, 0) * 0.15;

  // Alerts
  const alerts = [];
  if (totalPower > 1.6) alerts.push('⚠ High Power Usage Detected');
  if (powerFactor < 0.8) alerts.push('⚠ Low Power Factor – Consider Compensation');

  // Chart options (fix x axis type for Chart.js v4 and tooltip mode type)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: {
        type: 'time', // Chart.js expects 'time' for time scale
        time: { unit: 'second' },
        title: { display: true, text: 'Time' },
        grid: { display: false },
      },
      y: { beginAtZero: true, grid: { display: true } },
    },
    elements: {
      point: { radius: 0, hoverRadius: 3, hitRadius: 3 },
      line: { tension: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center p-4">
      <div className="w-full max-w-6xl bg-white border border-gray-200 p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#0057B8]">
          Dashboard for <span className="text-black">{device.name}</span>
        </h1>
        <section className="flex flex-wrap gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-gray-700 mb-1">Total Power Usage</h3>
            <p className="text-xl font-bold" data-testid="totalPower">{totalPower} kW</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-gray-700 mb-1">Peak Demand</h3>
            <p className="text-xl font-bold" data-testid="peakDemand">{peakDemand.toFixed(2)} kW</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-gray-700 mb-1">Power Factor</h3>
            <p className="text-xl font-bold" data-testid="powerFactor">{powerFactor}</p>
          </div>
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[180px] text-center metric-card">
            <h3 className="font-semibold text-gray-700 mb-1">Voltage Levels</h3>
            <p className="text-xl font-bold" data-testid="voltageLevels">{voltageLevels} V</p>
          </div>
        </section>
        <h2 className="text-xl font-semibold mb-2 mt-4">Live Power Monitoring</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 charts-grid">
          <div className="bg-white p-4 rounded shadow chart-container">
            <h3 className="font-semibold mb-2">Power Usage (kW)</h3>
            <Line
              data={{
                labels,
                datasets: [{
                  label: 'Power (kW)',
                  data: powerData,
                  borderColor: '#6ec800',
                  backgroundColor: 'rgba(110,200,0,0.1)',
                  fill: false,
                }],
              }}
              options={chartOptions}
            />
          </div>
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
              options={chartOptions}
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
              options={chartOptions}
            />
          </div>
          <div className="bg-white p-4 rounded shadow chart-container">
            <h3 className="font-semibold mb-2">Power Factor</h3>
            <Line
              data={{
                labels,
                datasets: [{
                  label: 'Power Factor',
                  data: pfData,
                  borderColor: '#d80032',
                  backgroundColor: 'rgba(216,0,50,0.1)',
                  fill: false,
                }],
              }}
              options={chartOptions}
            />
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-2">Estimated Cost</h2>
        <p className="mb-4">Estimated Consumption Cost: <strong data-testid="energyCost">${cost.toFixed(2)}</strong></p>
        <h2 className="text-lg font-semibold mb-2">Alerts & Faults</h2>
        <ul className="mb-4" data-testid="alertList">
          {alerts.length ? alerts.map((a, i) => <li key={i}>{a}</li>) : <li>No active alerts</li>}
        </ul>
        <div className="flex gap-4 justify-center button-group mt-6">
          <button
            className="px-6 py-2 rounded bg-[#005792] text-white hover:bg-[#6ec800] transition"
            onClick={() => alert('Go to Configuration (not implemented)')}
          >
            Go to Configuration
          </button>
          <button
            className="px-6 py-2 rounded bg-[#005792] text-white hover:bg-[#6ec800] transition"
            onClick={() => alert('Data export coming soon!')}
          >
            Download Reports
          </button>
        </div>
      </div>
    </div>
  );
}
