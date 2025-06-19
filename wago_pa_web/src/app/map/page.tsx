// app/map/page.tsx or wherever your MapScreen lives
"use client";
import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import DeviceInfoPopup from "./DeviceInfoPopup";
import { useDevices } from "../utils/VirtualDeviceStore"; // Import your device data



// Set map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 41.0082,
  lng: 28.9784,
};

export const API_KEY = "AIzaSyD-6wlPgPO1Njypt9V5DJCmVNdMkuaI_bo"; // 🔁 Replace with your actual API key

type Device = { id: string; name: string; latitude: number; longitude: number };

export default function MapScreen() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const { devices } = useDevices(); // Fetch devices from your store

  return (
    <div
      style={{ background: "#F5F7FA", minHeight: "100vh" }}
      className="flex flex-col items-center p-4"
    >
      {/* <div style={{ background: '#fff', border: '1px solid #E5E7EB' }} className="p-8 rounded shadow-md w-full max-w-3xl">
        <h1 style={{ color: '#0057B8' }} className="text-2xl font-bold text-center mb-6">Device Map</h1> */}

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
