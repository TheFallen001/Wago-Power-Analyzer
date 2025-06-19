import React from 'react';
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

const mockSiteInfo = {
  name: 'Irq Al Basrah Times Square Mall',
  area: '842.00 m²',
  power: '200 kVA',
  lastData: '16/06/2025 14:30',
  weather: 'Clear',
  temperature: '48.6°C',
  alarms: '-',
  image: '/WAGO.svg',
};

const mockMetrics = [
  { label: 'Grid Consumption (kWh)', value: '216.30', icon: '⚡' },
  { label: 'Gas (m³)', value: '-', icon: '🔥' },
  { label: 'Reactive Inductive Ratio', value: '0.56', icon: '%' },
  { label: 'Reactive Capacitive Ratio', value: '6.31', icon: '%' },
  { label: 'Carbon Emission (TON)', value: '0.12', icon: '☁️' },
  { label: 'Water (m³)', value: '-', icon: '💧' },
  { label: 'Energy Cost', value: '36', icon: '💵' },
  { label: 'Energy Intensity (kWh/m²)', value: '0.256', icon: '📊' },
];

const pieData = {
  labels: ['A', 'B'],
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ['#2196f3', '#009688'],
      borderWidth: 0,
    },
  ],
};

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
      data: [20, 10, 30, 50, 55, 55],
      fill: false,
      borderColor: '#43a047',
      tension: 0.4,
    },
  ],
};

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Site Info */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
            <Image src={mockSiteInfo.image} alt="Site" layout="fill" objectFit="cover" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 text-xl">☀️</span>
              <span className="font-medium">{mockSiteInfo.weather}</span>
              <span className="text-gray-700">{mockSiteInfo.temperature}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-xl">🔔</span>
              <span className="font-medium">Alarms</span>
              <span className="text-gray-700">{mockSiteInfo.alarms}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-bold mt-2">SITE NAME</div>
          <div className="text-sm mb-1">{mockSiteInfo.name}</div>
          <div className="text-xs text-gray-500 font-bold">TOTAL AREA</div>
          <div className="text-sm mb-1">{mockSiteInfo.area}</div>
          <div className="text-xs text-gray-500 font-bold">INSTALLED POWER</div>
          <div className="text-sm mb-1">{mockSiteInfo.power}</div>
          <div className="text-xs text-gray-500 font-bold">LAST DATA</div>
          <div className="text-sm flex items-center">
            <span className="mr-1">🕒</span> {mockSiteInfo.lastData}
          </div>
        </div>
        {/* Metrics */}
        <div className="bg-white rounded-xl shadow p-4 col-span-2 flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockMetrics.map((m, i) => (
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
            <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
          </div>
        </div>
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <div className="font-bold mb-2">Consumption Chart</div>
          <div className="w-full h-56">
            <Line data={lineData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, max: 200, title: { display: true, text: 'Power (kW)' } },
              },
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
