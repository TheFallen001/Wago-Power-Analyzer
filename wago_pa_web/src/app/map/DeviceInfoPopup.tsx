import { useRouter } from "next/navigation";

interface DeviceInfoPopupProps {
  device: Device;
  onClose: () => void;
}

interface Device {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
}


export default function DeviceInfoPopup({
  device,
  onClose,
}: DeviceInfoPopupProps) {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    
    
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const router = useRouter();
  const handleRouting = () => {
    // Implement routing logic here
    router.push("/configure");
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-2 text-[#6EC800]">{device.name}</h2>
        <p className="text-sm text-gray-600">ID: {device.id}</p>
        <p className="text-sm text-gray-600">Latitude: {device.latitude}</p>
        <p className="text-sm text-gray-600">Longitude: {device.longitude}</p>
        <button
          // onClick={onClose}
          className="mt-4 bg-[#28a745] text-white px-4 py-2 rounded hover:bg-[#6EC800] transition-colors duration-300"

          onClick={() => {handleRouting()}}
        >
          Configure
        </button>
      </div>
    </div>
  );
}
