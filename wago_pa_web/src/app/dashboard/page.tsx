"use client";

import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { useDevices } from '../utils/VirtualDeviceStore';

const SITE_AREA = 842; // m², replace with dynamic value if available
const INSTALLED_POWER = 200; // kVA, replace with dynamic value if available

function getLatestTimestamp(devices: Array<{ config: any; name: string }>) {
  // If you have timestamps in device data, use them. Otherwise, use Date.now()
  return new Date().toLocaleString();
}

function getTotalEnergy(devices: Array<{ config: any; name: string }>) {
  // Replace 'energy' with the correct property from your device config
  return devices.reduce((sum, d) => sum + (d.config.energy || 0), 0);
}

function getReactiveInductiveRatio(devices: Array<{ config: any; name: string }>) {
  // Replace with real calculation if available
  return devices.length ? (devices[0].config.reactiveInductiveRatio || 0) : 0;
}

function getReactiveCapacitiveRatio(devices: Array<{ config: any; name: string }>) {
  // Replace with real calculation if available
  return devices.length ? (devices[0].config.reactiveCapacitiveRatio || 0) : 0;
}

function getCarbonEmission(totalEnergy: number) {
  // Example: 0.000475 tons CO2 per kWh (adjust for your region)
  return (totalEnergy * 0.000475).toFixed(3);
}

function getEnergyCost(totalEnergy: number) {
  // Example: 0.15 currency units per kWh
  return (totalEnergy * 0.15).toFixed(2);
}

function getEnergyIntensity(totalEnergy: number, area: number) {
  return area ? (totalEnergy / area).toFixed(3) : '-';
}

export default function Dashboard() {
  const { devices } = useDevices();
  const totalEnergy = getTotalEnergy(devices);
  const energyIntensity = getEnergyIntensity(totalEnergy, SITE_AREA);
  const carbonEmission = getCarbonEmission(totalEnergy);
  const energyCost = getEnergyCost(totalEnergy);
  const reactiveInductiveRatio = getReactiveInductiveRatio(devices);
  const reactiveCapacitiveRatio = getReactiveCapacitiveRatio(devices);
  const lastData = getLatestTimestamp(devices);

  // Pie chart: energy by device
  const pieData = {
    labels: devices.map(d => d.name),
    datasets: [{
      data: devices.map(d => d.config.energy || 0),
      backgroundColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6', '#818CF8', '#F59E42'],
    }],
  };

  // Line chart: simulate time series (replace with real time series if available)
  const lineData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Power (kW)',
        data: devices.map((d, i) => (d.config.power || 0) + i * 5),
        fill: false,
        borderColor: '#43a047',
        tension: 0.4,
      },
    ],
  };

  const metrics = [
    { label: 'Grid Consumption (kWh)', value: totalEnergy.toFixed(2), icon: '⚡' },
    { label: 'Gas (m³)', value: '-', icon: '🔥' },
    { label: 'Reactive Inductive Ratio', value: reactiveInductiveRatio, icon: '%' },
    { label: 'Reactive Capacitive Ratio', value: reactiveCapacitiveRatio, icon: '%' },
    { label: 'Carbon Emission (TON)', value: carbonEmission, icon: '☁️' },
    { label: 'Water (m³)', value: '-', icon: '💧' },
    { label: 'Energy Cost', value: energyCost, icon: '💵' },
    { label: 'Energy Intensity (kWh/m²)', value: energyIntensity, icon: '📊' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Site Info */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
            {/* Replace with real image if available */}
            <img src="/WAGO.svg" alt="Site" className="object-cover w-full h-full" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 text-xl">☀️</span>
              <span className="font-medium">Clear</span>
              <span className="text-gray-700">48.6°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-xl">🔔</span>
              <span className="font-medium">Alarms</span>
              <span className="text-gray-700">-</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-bold mt-2">SITE NAME</div>
          <div className="text-sm mb-1">Irq Al Basrah Times Square Mall</div>
          <div className="text-xs text-gray-500 font-bold">TOTAL AREA</div>
          <div className="text-sm mb-1">{SITE_AREA} m²</div>
          <div className="text-xs text-gray-500 font-bold">INSTALLED POWER</div>
          <div className="text-sm mb-1">{INSTALLED_POWER} kVA</div>
          <div className="text-xs text-gray-500 font-bold">LAST DATA</div>
          <div className="text-sm flex items-center">
            <span className="mr-1">🕒</span> {lastData}
          </div>
        </div>
        {/* Metrics */}
        <div className="bg-white rounded-xl shadow p-4 col-span-2 flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center border-r last:border-r-0 border-gray-200 py-2">
                <span className="text-2xl mb-1">{m.icon}</span>
                <span className="text-2xl font-bold text-gray-800">{m.value}</span>
                <span className="text-xs text-gray-500 text-center">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="font-bold mb-2">Circular Consumption Chart</div>
          <div className="w-56 h-56">
            <Pie data={pieData} options={{ plugins: { legend: { display: true } } }} />
          </div>
        </div>
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="font-bold mb-2">Consumption Chart</div>
          <div className="w-full h-56 flex justify-center">
            <Line data={lineData} options={{
              responsive: true,
              plugins: { legend: { display: true } },
              scales: {
                y: { beginAtZero: true, max: 200, title: { display: true, text: 'Power (kW)' } },
                x: {},
              },
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
