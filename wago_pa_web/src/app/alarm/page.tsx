// Web version of AlarmScreen using Tailwind CSS
"use client";
import React, { useEffect, useState } from "react";
import { subscribeToAlarms } from '../utils/DeviceStore';

interface AlarmHistoryItem {
  id: string;
  device: string;
  message: string;
  timestamp: string;
}

export default function Alarm() {
  const [alarmHistory, setAlarmHistory] = useState<AlarmHistoryItem[]>([]);

  useEffect(() => {
    // Listen for alarms and add to history only if value or type changed for the device
    let lastAlarmMap: { [key: string]: { type: string; value: number } } = {};
    const unsub = subscribeToAlarms((alarm) => {
      const key = alarm.deviceName + '-' + alarm.type;
      const last = lastAlarmMap[key];
      // Only add to history if value or type changed
      if (!last || last.value !== alarm.value) {
        lastAlarmMap[key] = { type: alarm.type, value: alarm.value };
        const now = new Date();
        setAlarmHistory((prev) => [
          {
            id: now.getTime().toString() + Math.random().toString(36).slice(2),
            device: alarm.deviceName || 'Unknown Device',
            message:
              alarm.type === 'volt'
                ? `Voltage out of range: ${alarm.value}`
                : `Current out of range: ${alarm.value}`,
            timestamp: now.toLocaleString(),
          },
          ...prev,
        ]);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100vh' }} className="flex flex-col items-center p-4">
      <div style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-2xl">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold text-center mb-6">Alarm History</h1>
        <div className="overflow-y-auto max-h-96 divide-y">
          {alarmHistory.length === 0 ? (
            <div style={{ color: '#6B7280' }} className="text-center">No alarms yet.</div>
          ) : (
            alarmHistory.map(item => (
              <div key={item.id} className="py-3 flex flex-col">
                <span style={{ color: '#22223B' }} className="font-semibold">{item.device}</span>
                <span style={{ color: '#FFB800' }} className="">{item.message}</span>
                <span style={{ color: '#6B7280' }} className="text-xs">{item.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
