// DeviceStore.ts (web)
// Only contains shared types and utilities. All device logic is now in VirtualDeviceStore and ModbusDeviceStore.
import GOOGLE_API_KEY from "../../../../test"

export type Device = {
  currentMax: number;
  currentMin: number;
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  voltageRange: string;
  status: string;
  config: any; // Use specific config types in VirtualDeviceStore/ModbusDeviceStore
};



export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    }
    return null;
  } catch (e) {
    console.error("Geocoding error:", e);
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (e) {
    console.error("Reverse geocoding error:", e);
    return null;
  }
}


// All device logic is now in VirtualDeviceStore.ts and ModbusDeviceStore.ts
// This file should only be used for shared types/utilities.