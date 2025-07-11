// Web version of AddPA screen using Tailwind CSS
"use client";
import React, { useState, useEffect } from "react";
import { addModbusDevice } from "../utils/ModbusDeviceStore";
import { reverseGeocode } from "../utils/DeviceStore";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
// TODO: Replace with your actual Google Maps API key or use an environment variable
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";// TODO: Replace with your actual Google Maps API key or use an environment variable

export default function AddPA() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hostAddress, setHostAddress] = useState("localhost");
  const [port, setPort] = useState<number | undefined>(502);
  const [clientID, setClientID] = useState<number | undefined>(0);
  const [status, setStatus] = useState("Active");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Synchronize: when address changes, geocode and update marker
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (address) {
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const loc = results[0].geometry.location;
              setLocation({ lat: loc.lat(), lng: loc.lng() });
            }
          });
        }
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [address]);

  // Synchronize: when marker is set but address is empty, reverse geocode
  // Synchronize: when marker is set, update address with reverse geocode or fallback to coordinates
  useEffect(() => {
    if (location) {
      (async () => {
        const addr = await reverseGeocode(location.lat, location.lng);
        if (addr && addr.trim() !== "") {
          setAddress(addr);
        } else {
          setAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
        }
      })();
    }
  }, [location]);

  // When address changes, geocode and update marker (web version: skip geocode, just keep address)

  // When user clicks on the map, reverse geocode and update address
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocation({ lat, lng });
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location?.lat || !location.lng || !address) {
      alert("Please fill in all required fields (Name, Address, Latitude, Longitude).");
      return;
    }

    const newDevice = {
      id: Date.now().toString(),
      name,
      latitude: location.lat,
      longitude: location.lng,
      address,
      voltageRange: "230V",
      currentMax: 2.0,
      currentMin: 0,
      status,
      config: {
        Addr1: 1,
        Baud1: 9600,
        Check1: 2,
        Baud2: 57600,
        Check2: 2,
        "645Addr": 0,
        Language: 0,
      },
    };

    setIsSaving(true);
    addModbusDevice(newDevice, { hostAddress, port, clientID });
    setTimeout(() => {
      setIsSaving(false);
      alert("Device added!");
      setName("");
      setAddress("");
      setLocation(null);
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
      className="flex flex-col items-center p-4"
    >
      <form
        onSubmit={handleAddDevice}
        style={{ background: "#fff", border: "1px solid #E5E7EB", maxWidth: 800 }}
        className="p-8 rounded shadow-md w-full"
      >
        <h1
          style={{ color: "#28a745" }}
          className="text-2xl font-bold mb-6 text-center"
        >
          Add Device
        </h1>
        <div className="mb-4">
          <label style={{ color: "#22223B" }} className="block mb-1 font-medium">
            Device Name *
          </label>
          <input
            type="text"
            style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#000000" }}
            className="w-full rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter device name"
            required
          />
        </div>
        <div className="mb-4">
          <label style={{ color: "#22223B" }} className="block mb-1 font-medium">
            IP Address*
          </label>
          <input
            type="text"
            style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#000000" }}
            className="w-full rounded px-3 py-2"
            value={hostAddress}
            onChange={(e) => setHostAddress(e.target.value)}
            placeholder="Default IP: localhost"
            required
          />
        </div>
        <div className="mb-4">
          <label style={{ color: "#22223B" }} className="block mb-1 font-medium">
            Port Number*
          </label>
          <input
            type="number"
            style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#000000" }}
            className="w-full rounded px-3 py-2"
            value={port ?? ""}
            onChange={(e) => setPort(Number(e.target.value))}
            placeholder="Default Port: 502"
            required
          />
        </div>
        <div className="mb-4">
          <label style={{ color: "#22223B" }} className="block mb-1 font-medium">
            Client ID*
          </label>
          <input
            type="number"
            style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#000000" }}
            className="w-full rounded px-3 py-2"
            value={clientID ?? ""}
            onChange={(e) => setClientID(Number(e.target.value))}
            placeholder="Default Client ID: 0"
            required
          />
        </div>
        <div className="mb-4">
          <label style={{ color: "#22223B" }} className="block mb-1 font-medium">
            Address *
          </label>
          <input
            type="text"
            style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#000000" }}
            className="w-full rounded px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-4 h-70 w-full">
          <label style={{ color: "#22223B" }} className="block mb-1 font-medium">
            Location *
          </label>
          <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onClick={handleMapClick}
            >
              {location && <Marker position={location} />}
            </GoogleMap>
          </LoadScript>
        </div>
        <div className="mb-4 mt-10">
          <label style={{ color: "#22223B" }} className="block mb-1 font-medium">
            Status
          </label>
          <select
            style={{ background: "#F3F4F6", border: "1px solid #E5E7EB", color: "#22223B" }}
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
