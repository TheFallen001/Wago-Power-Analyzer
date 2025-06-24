// Web version of AddPA screen using Tailwind CSS
"use client";
import React, { useState } from "react";
import { addDevice } from "../utils/VirtualDeviceStore";
import { reverseGeocode } from "../utils/DeviceStore";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { API_KEY } from "../map/page";

export default function AddPA() {
  const [name, setName] = useState("");

  const [status, setStatus] = useState("Active");
  const [isSaving, setIsSaving] = useState(false);
  const [address, setAddress] = useState("");

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    { lat: 41.0082, lng: 28.9784 }
  );

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location?.lat || !location.lng) {
      alert("Please fill in all required fields (Name, Latitude, Longitude).");
      return;
    }

    const addr = await reverseGeocode(location.lat, location.lng);
    
    setAddress(addr ?? "");
    const newDevice = {
      id: Date.now().toString(),
      name,
      latitude: location.lat,
      longitude: location.lng,
      status,
      address: address ?? "",
      voltageRange: "230V", // Default value
      currentMax: 2.0, // Default value
      currentMin: 0, // Default value
      config: {
        addr1: 1, // Default value
        baud1: 9600, // Default value
        check1: 2, // Default: Parity
        stopBit1: 1, // Default: 1.5 stop bit
        baud2: 57600, // Default value
        check2: 2, // Default: Parity
        stopBit2: 1, // Default: 1.5 stop bit
      },
    };

    setIsSaving(true);
    addDevice(newDevice)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      alert("Device added!");
      setName("");
    }, 1000);
  };

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 41.0082,
    lng: 28.9784,
  };

  return (
    <div
      style={{ background: "#F5F7FA", minHeight: "100vh" }}
      className="flex flex-col items-center  p-4"
    >
      <form
        onSubmit={handleAddDevice}
        style={{ background: "#fff", border: "1px solid #E5E7EB" }}
        className="p-8 rounded shadow-md w-full max-w-md"
      >
        <h1
          style={{ color: "#28a745" }}
          className="text-2xl font-bold mb-6 text-center"
        >
          Add Device
        </h1>
        <div className="mb-4">
          <label
            style={{ color: "#22223B" }}
            className="block mb-1 font-medium"
          >
            Name
          </label>
          <input
            type="text"
            style={{
              background: "#F3F4F6",
              border: "1px solid #E5E7EB",
              color: "#000000", // <-- added
            }}
            className="w-full rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 h-70 w-full">
          <label
            style={{ color: "#22223B" }}
            className="block mb-1 font-medium"
          >
            Location
          </label>
          <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onClick={(e) =>
                setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
              }
            >
              {location && <Marker position={location} />}
            </GoogleMap>
          </LoadScript>
        </div>
        <div className="mb-4">
          <label
            style={{ color: "#22223B" }}
            className="block mb-1 font-medium"
          >
            Status
          </label>
          <select
            style={{
              background: "#F3F4F6",
              border: "1px solid #E5E7EB",
              color: "#22223B",
            }}
            className="w-full rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          style={{ background: "#28a745", color: "#fff" }}
          className="w-full py-2 rounded hover:bg-[#FFB800] transition"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Add Device"}
        </button>
      </form>
    </div>
  );
}
