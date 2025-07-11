"use client";
import Link from "next/link";
import { ModbusDevice, ModbusDevices, subscribeToDeviceUpdates } from "../utils/ModbusDeviceStore";
import { useEffect, useState } from "react";

function useModbusDevices() {
  const [devices, setDevices] = useState<ModbusDevice[]>([...ModbusDevices]);
  useEffect(() => {
    const unsubscribe = subscribeToDeviceUpdates((newDevices) => {
      console.log("Devices updated:", newDevices);
      setDevices([...newDevices]);
    });
    return unsubscribe;
  }, []);
  return { devices };
}

export default function DevicesPage() {
  const { devices } = useModbusDevices();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-[#28a745] mb-8 drop-shadow-sm">
        Your Devices
      </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[90rem] px-4">        {devices.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10 text-lg">
            No devices found. Time to add some!
          </div>
        )}
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col border border-gray-200 transform hover:-translate-y-1"
          >
            <div className="font-bold text-xl mb-3 text-[#6EC800] flex items-center">
              {device.name}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm flex-grow">
              {/* General Information */}
              <div className="col-span-2 sm:col-span-1">
                <strong className="text-gray-900">ID:</strong> {device.id}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <strong className="text-gray-900">Status:</strong>{" "}
                <span
                  className={
                    device.status === "ALARM" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"
                  }
                >
                  {device.status}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <strong className="text-gray-900">Address:</strong>{" "}
                {device.latitude && device.longitude ? `${device.latitude}, ${device.longitude}` : "N/A"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <strong className="text-gray-900">Type:</strong>{" "}
                {device.deviceType || "N/A"}
              </div>

              {/* Configuration Details - Grouped for better readability */}
              <div className="col-span-2 border-t pt-2 mt-2 border-gray-100">
                <strong className="text-gray-900">Configuration:</strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-600">Addr1:</span> {device.config.Addr1 || "N/A"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-600">645Addr:</span>{" "}
                {device.config["645Addr"] || "N/A"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-600">Baud1:</span> {device.config.Baud1 || "N/A"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-600">Baud2:</span> {device.config.Baud2 || "N/A"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-600">Check1:</span> {device.config.Check1 || "N/A"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-600">Check2:</span> {device.config.Check2 || "N/A"}
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Language:</span>{" "}
                {device.config.Language || "N/A"}
              </div>
            </div>

            <div className="mt-6 flex flex-col space-y-3">
              <Link
                href={`/NewDetail/${device.id}`}
                className="w-full px-5 py-2.5 rounded-lg bg-[#28a745] text-white text-center font-medium hover:bg-[#6ec800] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View Details
              </Link>
              <Link
                href={`/configure/`}
                className="w-full px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 text-center font-medium hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Configure Device
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}