"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./globals.css";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import WagoLogo from "../../public/WAGO.svg";

const Drawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
 
  const navItems = [
    { name: "Map", path: "/map" },
    { name: "Add PA", path: "/add-pa" },
    { name: "Configure", path: "/configure" },
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
                  <div className={`block p-2 rounded `} onClick={onClose}>
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

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/");
  };
  return (
    <div className="relative top-0 w-full h-fit px-10 bg-white ">
      <div className="justify-between bg- flex flex-row p-6 ">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed top-10 z-50 px-4 py-2 bg-[#6EC800] text-white rounded shadow-lg"
        >
          <Menu size={30} />
        </button>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <Image src={WagoLogo} alt="WAGO Logo" className="w-50 h-30 ml-30" onClick={() => handleRedirect()} />
      </div>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-row">
        <main className="flex-1 ml-0 md:ml-0 transition-all duration-300">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
