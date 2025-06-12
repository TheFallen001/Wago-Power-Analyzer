"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./globals.css";
import { Menu, X } from "lucide-react";

const Drawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const navItems = [
    { name: "Map", path: "/" },
    { name: "Add PA", path: "/add_pa" },
    { name: "Devices", path: "/devices" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 w-120 bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-50`}
    >
      <div className="p-4">
        <button onClick={onClose} className="relative text-white mb-4 mr-4  ">
          <X size={30} />
        </button>

        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link href={item.path}>
                  <div
                    className={`block p-2 rounded `}
                    onClick={onClose}
                  >
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default function RootLayout({ children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-row">
        <div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="m-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Menu />
          </button>

          {/* Always render the Drawer but control visibility with isOpen */}
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />

          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
