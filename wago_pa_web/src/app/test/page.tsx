//This was a test page for Ugur bey

"use client";
import React, { useEffect, useRef } from 'react';
import { useDevices } from "../utils/VirtualDeviceStore";

const MAX_TANK_LEVEL = 100.0;
const TARGET_TEMPERATURE = 90.0;
const MAX_PRESSURE = 10.0;
const SVG_TANK_MAX_HEIGHT = 130;
const SVG_TANK_TOP_Y = 20;

const getDeviceById = (devices: any[], id: number) => {
  if (Array.isArray(devices)) {
    return devices.find((d) => d.id === id) || {
      tankLevel: 0,
      temperature: 25,
      pressure: 1.2,
      valveIn: false,
      valveOut: false,
      systemStatus: 'idle',
    };
  }
  return {
    tankLevel: 0,
    temperature: 25,
    pressure: 1.2,
    valveIn: false,
    valveOut: false,
    systemStatus: 'idle',
  };
};

const HmiScadaPanel: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const { devices } = useDevices();
  const [deviceData, setDeviceData] = React.useState(getDeviceById(devices, 1));
  const device = devices.find((d) => d.id === '1') || deviceData; // Fallback to initial data if not found
  const volt = device?.config?.volt ?? '-';

  // Chart.js setup
  useEffect(() => {
    if (chartRef.current && !chartInstance.current && typeof window !== 'undefined' && (window as any).Chart) {
      const Chart = (window as any).Chart;
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Sıcaklık (°C)',
            data: [],
            borderColor: '#6ec800',
            backgroundColor: 'rgba(110, 200, 0, 0.2)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              suggestedMin: 20,
              suggestedMax: 100,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#ffffff' },
            },
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#ffffff' },
            },
          },
          plugins: {
            legend: {
              labels: { color: '#ffffff' },
            },
          },
        },
      });
    }
  }, []);

  // Poll device data from VirtualDeviceStore
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const poll = () => {
      setDeviceData(getDeviceById(devices, 1));
    };
    poll();
    interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [devices]);

  // Update chart
  useEffect(() => {
    if (chartInstance.current) {
      const now = new Date();
      const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const chart = chartInstance.current;
      chart.data.labels.push(timeLabel);
      chart.data.datasets[0].data.push(deviceData.temperature);
      if (chart.data.labels.length > 30) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update('none');
    }
  }, [deviceData.temperature]);

  // UI calculations
  const tankPercentage = (deviceData.tankLevel / MAX_TANK_LEVEL) * 100;
  const liquidHeight = (tankPercentage / 100) * SVG_TANK_MAX_HEIGHT;
  const yPos = SVG_TANK_TOP_Y + SVG_TANK_MAX_HEIGHT - liquidHeight;
  const tempPercentage = (deviceData.temperature / (TARGET_TEMPERATURE + 10)) * 100;
  const pressurePercentage = (deviceData.pressure / MAX_PRESSURE) * 100;

  return (
    <div className="container mx-auto p-4 md:p-8 text-white">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Endüstriyel Kontrol Paneli (HMI/SCADA)</h1>
        <p className="text-gray-300 mt-2">Sistem Durumu ve Proses Takibi</p>
      </header>
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Control Panel */}
        <div className="bg-anthracite p-6 rounded-2xl shadow-2xl border border-gray-700 md:col-span-2 lg:col-span-4 flex justify-center items-center">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full status-indicator ${
                deviceData.systemStatus === 'running'
                  ? 'status-on'
                  : deviceData.systemStatus === 'idle'
                  ? 'status-idle'
                  : 'status-off'
              }`}
            ></div>
            <h2
              className={`text-2xl font-semibold ${
                deviceData.systemStatus === 'running' ? 'text-primary-green' : ''
              }`}
            >
              {deviceData.systemStatus === 'running'
                ? 'PROSES ÇALIŞIYOR'
                : deviceData.systemStatus === 'idle'
                ? 'SİSTEM BEKLEMEDE'
                : 'SİSTEM BAŞLATILIYOR...'}
            </h2>
          </div>
        </div>
        {/* Tank Level */}
        <div className="bg-anthracite p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col justify-between text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Tank Seviyesi</h3>
          <div className="relative w-40 h-64 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 160">
              <rect id="tank-background" x="10" y="20" width="80" height="130" rx="5" ry="5" fill="rgba(255, 255, 255, 0.05)" />
              <rect
                id="tank-liquid"
                x="10"
                y={yPos}
                width="80"
                height={liquidHeight}
                rx="5"
                ry="5"
                fill="#6ec800"
                style={{ transition: 'y 1s ease-out, height 1s ease-out' }}
              />
              <path d="M95,20 C95,11.7 88.3,5 80,5 L20,5 C11.7,5 5,11.7 5,20 L5,150 C5,155.5 9.5,160 15,160 L85,160 C90.5,160 95,155.5 95,150 Z" strokeWidth="3" fill="transparent" className="stroke-gray-500" />
              <path d="M80,5 C88.3,5 95,11.7 95,20 L95,22 C95,13.7 88.3,7 80,7 L20,7 C11.7,7 5,13.7 5,22 L5,20 C5,11.7 11.7,5 20,5 Z" className="fill-gray-600" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold gauge-value text-white">{volt} L</span>
            </div>
          </div>
        </div>
        {/* Temperature Gauge */}
        <div className="bg-anthracite p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Kazan Sıcaklığı</h3>
          <div className="my-auto">
            <p className="text-7xl font-bold gauge-value text-white" id="temperature-value">
              {deviceData.temperature.toFixed(1)}
            </p>
            <span className="text-2xl text-gray-400">°C</span>
            <div className="w-full bg-[#1f2837] rounded-full h-4 mt-4 border border-gray-600">
              <div
                id="temperature-bar"
                className="bg-primary-green h-full rounded-full"
                style={{ width: `${tempPercentage}%`, transition: 'width 1s ease-out' }}
              ></div>
            </div>
          </div>
        </div>
        {/* Pressure Gauge */}
        <div className="bg-anthracite p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Hat Basıncı</h3>
          <div className="my-auto">
            <p className="text-7xl font-bold gauge-value text-white" id="pressure-value">
              {deviceData.pressure.toFixed(1)}
            </p>
            <span className="text-2xl text-gray-400">Bar</span>
            <div className="w-full bg-[#1f2837] rounded-full h-4 mt-4 border border-gray-600">
              <div
                id="pressure-bar"
                className="bg-primary-green h-full rounded-full"
                style={{ width: `${pressurePercentage}%`, transition: 'width 1s ease-out' }}
              ></div>
            </div>
          </div>
        </div>
        {/* Valve Status */}
        <div className="bg-anthracite p-6 rounded-2xl shadow-2xl border border-gray-700 text-center flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-white mb-4">Vana Durumları</h3>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center bg-[#1f2837] p-3 rounded-lg">
              <span className="font-semibold">Giriş Vanası (V-101)</span>
              <div
                id="valve-in-status"
                className={`w-6 h-6 rounded-full status-indicator ${deviceData.valveIn ? 'status-on' : 'status-off'}`}
              ></div>
            </div>
            <div className="flex justify-between items-center bg-[#1f2837] p-3 rounded-lg">
              <span className="font-semibold">Çıkış Vanası (V-102)</span>
              <div
                id="valve-out-status"
                className={`w-6 h-6 rounded-full status-indicator ${deviceData.valveOut ? 'status-on' : 'status-off'}`}
              ></div>
            </div>
          </div>
        </div>
        {/* Temperature Trend Chart */}
        <div className="bg-anthracite p-6 rounded-2xl shadow-2xl border border-gray-700 md:col-span-2 lg:col-span-4">
          <h3 className="text-xl font-semibold text-white mb-4">Sıcaklık Değişim Grafiği (Son 1 Dakika)</h3>
          <div className="relative h-80">
            <canvas ref={chartRef} id="temperature-chart"></canvas>
          </div>
        </div>
      </div>
      {/* Inline style for digital font */}
      <style>{`
        .gauge-value { font-family: 'Orbitron', sans-serif; text-shadow: 0 0 6px rgba(255,255,255,0.4); }
        .status-indicator { transition: background-color 0.3s, box-shadow 0.3s; }
        .bg-anthracite { background-color: #374151; }
        .text-primary-green { color: #6ec800; }
        .bg-primary-green { background-color: #6ec800; }
        .status-on { background-color: #6ec800; box-shadow: 0 0 15px #6ec800; }
        .status-off { background-color: #ef4444; box-shadow: 0 0 15px #ef4444; }
        .status-idle { background-color: #f59e0b; box-shadow: 0 0 15px #f59e0b; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </div>
  );
};

export default HmiScadaPanel;