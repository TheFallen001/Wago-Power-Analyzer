import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Device } from "../utils/DeviceStore";
import L from "leaflet";
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon URLs for leaflet markers (required for Metro/CRA/Vite)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface WebMapProps {
  devices: Device[];
  onMarkerClick: (device: Device) => void;
}

const istanbul: LatLngExpression = [41.0082, 28.9784];

const WebMap: React.FC<WebMapProps> = ({ devices, onMarkerClick }) => {
  return (
    <MapContainer
      center={istanbul}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {devices.map((device) => (
        <Marker
          key={device.id}
          position={[device.latitude, device.longitude] as LatLngExpression}
          eventHandlers={{
            click: () => onMarkerClick(device),
          }}
        >
          <Popup>
            <b>{device.name}</b>
            <br />
            Address: {device.address || "Unknown"}
            <br />
            Voltage Range: {device.voltageRange}
            <br />
            Status: {device.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WebMap;
