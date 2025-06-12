// Devices list page: shows all devices from DeviceStore and links to detail page
'use client';
import Link from 'next/link';
import { useDevices } from '../utils/DeviceStore';

export default function DevicesPage() {
  const { devices } = useDevices();

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <h1 className="text-2xl font-bold text-[#0057B8] mb-6">Devices</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No devices found.</div>
        )}
        {devices.map(device => (
          <div key={device.id} className="bg-white rounded shadow p-6 flex flex-col gap-2 border border-gray-200">
            <div className="font-semibold text-lg text-[#0057B8]">{device.name}</div>
            <div className="text-gray-700">ID: {device.id}</div>
            <div className="text-gray-700">Status: <span className={device.status === 'ALARM' ? 'text-red-600' : 'text-green-600'}>{device.status}</span></div>
            <div className="text-gray-700">Address: {device.address || 'N/A'}</div>
            <div className="flex-1" />
            <Link href={{ pathname: '/device-detail', query: { id: device.id } }} legacyBehavior>
              <a className="mt-2 px-4 py-2 rounded bg-[#005792] text-white hover:bg-[#6ec800] transition text-center">View Details</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
