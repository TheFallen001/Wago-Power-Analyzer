"use client";

import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

// Expanded Mock Data
const pieData = {
  labels: ['Off Hours', 'Auxiliary'],
  datasets: [
    {
      data: [34.1, 65.9],
      backgroundColor: ['#60A5FA', '#34D399'], // lighter blue, green
      borderWidth: 0,
    },
  ],
};

const barData = {
  labels: [
    'Active Consumption',
    'Reactive Inductive Consumption Penalty',
    'Reactive Inductive Consumption',
  ],
  datasets: [
    {
      label: 'Reactive Inductive Energy',
      data: [400000, 200000, 150000],
      backgroundColor: ['#60A5FA', '#34D399', '#FBBF24'],
    },
    {
      label: 'Reactive Inductive Energy 2',
      data: [300000, 100000, 120000],
      backgroundColor: ['#93C5FD', '#6EE7B7', '#FDE68A' ],
    },
  ],
};

const barData2 = {
  labels: [
    'Active Consumption',
    'Reactive Inductive Consumption Penalty',
    'Reactive Inductive Consumption',
  ],
  datasets: [
    {
      label: 'Reactive Capacitive Energy',
      data: [350000, 180000, 120000],
      backgroundColor: ['#60A5FA', '#34D399', '#FBBF24'],
    },
    {
      label: 'Reactive Capacitive Energy 2',
      data: [200000, 80000, 90000],
      backgroundColor: ['#93C5FD', '#6EE7B7', '#FDE68A'],
    },
  ],
};

const horizontalBarData = {
  labels: [
    'Central Anatolia Social Outlet',
    'Central Anatolia Panora Mall',
    'Central Anatolia Gordion Mall',
    'Central Anatolia Next Level Mall',
    'Central Anatolia Metropol Mall',
    'Central Anatolia Family Mall',
    'Central Anatolia Arcadium Mall',
    'Central Anatolia Ankamall',
    'Central Anatolia Cepa Mall',
    'Central Anatolia Kentpark Mall',
    'Central Anatolia Taurus Mall',
    'Central Anatolia Armada Mall',
    'Central Anatolia Atakule',
    'Central Anatolia Forum Ankara Mall',
    'Central Anatolia Nata Vega Mall',
    'Central Anatolia Podium Mall',
    'Central Anatolia Antares Mall',
    'Central Anatolia Kızılay Mall',
    'Central Anatolia Karum Mall',
    'Central Anatolia Tepe Prime Mall',
    'Central Anatolia Bilkent Center',
    'Central Anatolia Bilkent Station',
    'Central Anatolia Bilkent Hotel',
    'Central Anatolia Bilkent Cyberpark',
    'Central Anatolia Bilkent University',
    'Central Anatolia Mall X',
    'Central Anatolia Mall Y',
    'Central Anatolia Mall Z',
  ],
  datasets: [
    {
      label: 'Consumption',
      data: [100, 80, 60, 90, 120, 110, 70, 130, 50, 40, 30, 20, 10, 60, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 90, 60, 30],
      backgroundColor: '#6EE7B7',
    },
  ],
};

const tableData = [
  {
    name: 'Central Anatolia Social Outlet',
    total: '16,252,513',
    average: '8.01',
    january: '2,213,545',
    february: '7,813,950',
    march: '2,250,673',
    april: '2,250,673',
    may: '2,151,667',
    june: '15,879,879',
    july: '1,000,000',
    august: '1,200,000',
    september: '1,100,000',
    october: '1,300,000',
    november: '1,400,000',
    december: '1,500,000',
  },
  {
    name: 'Central Anatolia Panora Mall',
    total: '12,000,000',
    average: '7.50',
    january: '1,000,000',
    february: '1,200,000',
    march: '1,100,000',
    april: '1,300,000',
    may: '1,400,000',
    june: '1,500,000',
    july: '1,600,000',
    august: '1,700,000',
    september: '1,800,000',
    october: '1,900,000',
    november: '2,000,000',
    december: '2,100,000',
  },
  {
    name: 'Central Anatolia Gordion Mall',
    total: '10,000,000',
    average: '6.00',
    january: '800,000',
    february: '900,000',
    march: '1,000,000',
    april: '1,100,000',
    may: '1,200,000',
    june: '1,300,000',
    july: '1,400,000',
    august: '1,500,000',
    september: '1,600,000',
    october: '1,700,000',
    november: '1,800,000',
    december: '1,900,000',
  },
  // Add more rows as needed
];

const heatmapData = [
  [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300],
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180],
  [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240],
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Device Pie Charts Section
const deviceList = [
  'Central Anatolia Ceko Mall',
  'Bursa Times Square',
  'Ankara BDC Mall',
  'Kurt Kose',
  'Anatol Natural AVM',
  'Adli Family Fun Kids',
  'Adli Family Mall',
  'Grand Majid Mall',
  'Gulon Mall',
  'Kaya Store Outlet',
  'Suleymaniyah Family Mall',
  'Majid Mall',
];

const devicePieData = deviceList.map((name, idx) => ({
  name,
  data: {
    labels: ['Off Hours', 'Auxiliary'],
    datasets: [
      {
        data: [Math.floor(Math.random() * 60) + 20, Math.floor(Math.random() * 60) + 20],
        backgroundColor: ['#60A5FA', '#34D399'], // lighter blue, green
        borderWidth: 0,
      },
    ],
  },
}));

const Dashboard = () => {
    return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2 text-center text-gray-800">Circular Consumption Chart</h2>
          <div className="w-full h-48 flex items-center justify-center"><Pie data={pieData} options={{ plugins: { legend: { labels: { color: '#0F172A', font: { weight: 'bold' } } } } }} /></div>
          <div className="flex justify-center mt-2 text-xs text-gray-900 w-full">
            <div className="flex items-center mr-4"><span className="w-3 h-3 bg-gray-800 rounded-full inline-block mr-1"></span>34.1% Off Hours</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-slate-700 rounded-full inline-block mr-1"></span>65.9% Auxiliary</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2 text-center text-gray-800">Reactive Inductive Energy</h2>
          <div className="w-full h-48 flex items-center justify-center"><Bar data={barData} options={{ plugins: { legend: { labels: { color: '#0F172A', font: { weight: 'bold' } } } } }} /></div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2 text-center text-gray-800">Reactive Capacitive Energy</h2>
          <div className="w-full h-48 flex items-center justify-center"><Bar data={barData2} options={{ plugins: { legend: { labels: { color: '#0F172A', font: { weight: 'bold' } } } } }} /></div>
        </div>
      </div>

      {/* Device Pie Charts Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4 text-gray-800">Device Consumption Pie Charts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {devicePieData.map((dev, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-2 flex flex-col items-center border">
              <div className="text-xs font-semibold text-gray-800 mb-1 text-center truncate w-40">{dev.name}</div>
              <div className="w-28 h-28"><Pie data={dev.data} options={{ plugins: { legend: { display: true, labels: { color: '#0F172A', font: { weight: 'bold', size: 10 } } } } }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4 text-gray-800">Total Consumptions</h2>
        <div className="w-full" style={{ height: 500 }}>
          <Bar
            data={horizontalBarData}
            options={{
              indexAxis: 'y',
              maintainAspectRatio: false,
              plugins: { legend: { display: false, labels: { color: '#0F172A', font: { weight: 'bold' } } } },
              scales: { x: { beginAtZero: true, ticks: { color: '#0F172A' } }, y: { ticks: { color: '#0F172A' } } },
            }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4 text-gray-800">Monthly Consumption Energy Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left border">
            <thead className="bg-gray-100 text-gray-900">
              <tr>
                <th className="p-2 border">Site</th>
                <th className="p-2 border">Total (kWh)</th>
                <th className="p-2 border">Average (%)</th>
                {months.map((m) => (
                  <th key={m} className="p-2 border">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50 text-gray-900">
                  <td className="p-2 border">{row.name}</td>
                  <td className="p-2 border">{row.total}</td>
                  <td className="p-2 border">{row.average}</td>
                  {months.map((m) => {
                    const key = m.toLowerCase() as keyof typeof row;
                    return (
                      <td key={m} className="p-2 border">{row[key] || '-'}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4 text-gray-800">Consumption Map</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-center">
            <thead>
              <tr className="text-gray-900">
                <th className="p-2">Site</th>
                {months.map((m) => (
                  <th key={m} className="p-2">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 font-semibold text-gray-900">Site {i + 1}</td>
                  {row.map((val, j) => (
                    <td
                      key={j}
                      className="p-2"
                      style={{
                        background: `rgba(30,41,59,${val / 200 + 0.1})`,
                        color: val > 100 ? 'white' : '#0F172A',
                      }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
