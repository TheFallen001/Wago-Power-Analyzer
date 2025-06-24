"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { useParams } from 'next/navigation';
import { useDevices } from '../../utils/VirtualDeviceStore';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const SITE_AREA = 842; // m²
const INSTALLED_POWER = 200; // kVA

export default function NewDetail() {
  const { deviceId } = useParams();
  const { devices } = useDevices();
  const [lastData, setLastData] = useState('');
  // Add state for power history (6 time slots)
  const [powerHistory, setPowerHistory] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    setLastData(new Date().toLocaleString());
  }, []);

  // Find device by id (real-time from WDX via VirtualDeviceStore)
  const device = devices.find((d) => d.id === deviceId);

  // Real-time values from WDX (via device.config)
  const volt = device?.config?.volt ?? '-';
  const curr = device?.config?.curr ?? '-';
  const power = device?.config?.power ?? '-';
  const energy = device?.config?.energy ?? '-';

  // Update powerHistory when power changes
  useEffect(() => {
    if (typeof power === 'number') {
      // Define 6 time slots (e.g., 0, 4, 8, 12, 16, 20)
      const now = new Date();
      const hours = now.getHours();
      // Find the closest slot index
      const slotHours = [0, 4, 8, 12, 16, 20];
      let slotIndex = slotHours.findIndex((h, i) => hours >= h && (i === slotHours.length - 1 || hours < slotHours[i + 1]));
      if (slotIndex === -1) slotIndex = slotHours.length - 1;
      setPowerHistory((prev) => {
        const updated = [...prev];
        updated[slotIndex] = power;
        return updated;
      });
    }
  }, [power]);

  if (!device) return <div className="p-6">Device not found</div>;

  // Metrics
  const totalEnergy = typeof energy === 'number' ? energy : 0;
  const energyIntensity = SITE_AREA ? (totalEnergy / SITE_AREA).toFixed(3) : '-';
  const carbonEmission = (totalEnergy * 0.000475).toFixed(3);
  const energyCost = (totalEnergy * 0.15).toFixed(2);
  const reactiveInductiveRatio = device.config.reactiveInductiveRatio || '-';
  const reactiveCapacitiveRatio = device.config.reactiveCapacitiveRatio || '-';

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

  // Pie chart: device-specific breakdowns (real-time)
  const pieData = {
    labels: ['Energy', 'Other'],
    datasets: [
      {
        data: [totalEnergy, 100 - totalEnergy],
        backgroundColor: ['#2196f3', '#009688'],
        borderWidth: 0,
      },
    ],
  };

  // Line chart: show current power (real-time)
  const lineData = {
    labels: [
      '16. Jun',
      '04:00',
      '08:00',
      '12:00',
      '16:00',
      '20:00',
    ],
    datasets: [
      {
        label: 'Power (kW)',
        data: powerHistory,
        fill: false,
        borderColor: '#43a047',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Site Info */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
            <Image src={"/WAGO.svg"} alt="Site" layout="fill" objectFit="cover" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 text-xl">☀️</span>
              <span className="font-medium text-gray-600">Clear</span>
              <span className="text-gray-700">48.6°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-xl">🔔</span>
              <span className="font-medium text-gray-600">Alarms</span>
              <span className="text-gray-700">-</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-bold mt-2">SITE NAME</div>
          <div className="text-sm mb-1 text-gray-500">{device.name}</div>
          <div className="text-xs text-gray-500 font-bold">TOTAL AREA</div>
          <div className="text-sm mb-1 text-gray-500">{SITE_AREA} m²</div>
          <div className="text-xs text-gray-500 font-bold">INSTALLED POWER</div>
          <div className="text-sm mb-1 text-gray-500">{INSTALLED_POWER} kVA</div>
          <div className="text-xs text-gray-500 font-bold">LAST DATA</div>
          <div className="text-sm flex items-center text-gray-500">
            <span className="mr-1">🕒</span> {lastData}
          </div>
          <div className="text-xs text-gray-500 font-bold mt-2">REAL-TIME VALUES</div>
          <div className="text-sm mb-1 text-gray-500">Voltage: {volt}</div>
          <div className="text-sm mb-1 text-gray-500">Current: {curr}</div>
          <div className="text-sm mb-1 text-gray-500">Power: {power}</div>
          <div className="text-sm mb-1 text-gray-500">Energy: {energy}</div>
        </div>
        {/* Metrics */}
        <div className="bg-white rounded-xl shadow p-4 col-span-2 flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center border-r last:border-r-0 border-gray-200 py-2">
                <span className="text-2xl mb-1 text-gray-500">{m.icon}</span>
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
          <div className="font-bold mb-2 text-gray-800">Circular Consumption Chart</div>
          <div className="w-56 h-56">
            <Pie data={pieData} options={{ plugins: { legend: { display: true, labels: { color: '#1E293B', font: { weight: 'bold' } } } } }} />
          </div>
        </div>
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="font-bold mb-2 text-gray-800">Consumption Chart</div>
          <div className="w-full h-56 flex  justify-center">
            <Line data={lineData} options={{
              responsive: true,
              plugins: { legend: { display: true, labels: { color: '#1E293B', font: { weight: 'bold' } } } },
              scales: {
                y: { beginAtZero: true, max: 200, title: { display: true, text: 'Power (kW)', color: '#1E293B' }, ticks: { color: '#1E293B' } },
                x: { ticks: { color: '#1E293B' } },
              },
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
