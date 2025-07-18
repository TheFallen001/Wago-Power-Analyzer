// app/map/page.tsx or wherever your MapScreen lives
"use client";
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import DeviceInfoPopup from "./DeviceInfoPopup";
import { ModbusDevice, useModbusDevices, ModbusDevices, subscribeToDeviceUpdates } from "../utils/ModbusDeviceStore";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;// TODO: Replace with your actual Google Maps API key or use an environment variable

// Set map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 41.0082,
  lng: 28.9784,
};


export default function MapScreen() {
  const [selectedDevice, setSelectedDevice] = useState<ModbusDevice | null>(null);

  const { devices } = useModbusDevices(); // Fetch Modbus devices from your store
  

  return (
    <div
      style={{ background: "#F5F7FA", minHeight: "100vh" }}
      className="flex flex-col items-center p-4"
    >
      {/* Google Map */}
      <div
        className="w-full h-screen mb-4"
        style={{ border: "1px solid #E5E7EB" }}
      >
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
          >
            {devices.map((device) => (
              <Marker
                key={device.id}
                position={{ lat: device.latitude, lng: device.longitude }}
                title={device.name}
                onClick={() => setSelectedDevice(device)}
              />
            ))}
            {selectedDevice && (
              <DeviceInfoPopup
                device={selectedDevice}
                onClose={() => setSelectedDevice(null)}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
      {/* Device List */}
      {/* <div className="space-y-2">
          {devices.map(device => (
            <div key={device.id} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }} className="flex justify-between items-center p-3 rounded">
              <div>
                <div style={{ color: '#22223B' }} className="font-semibold">{device.name}</div>
                <div style={{ color: '#6B7280' }} className="text-xs">Lat: {device.latitude}, Lng: {device.longitude}</div>
              </div>
              <a href="/device-detail" style={{ background: '#0057B8', color: '#fff' }} className="px-3 py-1 rounded hover:bg-[#FFB800] transition">Details</a>
            </div>
          ))}
        </div> */}
      {/* </div> */}
    </div>
  );
}
