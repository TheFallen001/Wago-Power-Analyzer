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
  currentPage,
  setCurrentPage,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
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
      className={`fixed inset-y-0 left-0 w-120 bg-[#6EC800] text-white transform ${
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
                    className={`block p-2 rounded ${
                      currentPage === item.name ? "bg-[#e7ece0]" : ""
                    }`}
                    onClick={() => {
                      setCurrentPage(item.name);
                      onClose();
                    }}
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

const Header = ({
  currentPage,
  setCurrentPage,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/");
  };
  return (
    <div className="relative top-0 w-full px-5 h-fit bg-white ">
      <div className="flex flex-row p-6">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="text-gray-900 hover:text-gray-700 focus:outline-none mr-4 relative"
        >
          <Menu width={30} height={30} />
        </button>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <Image
          src={WagoLogo}
          alt="WAGO Logo"
          className="w-40 h-30 ml-10"
          onClick={() => handleRedirect()}
        />
      <div className="relative  w-full flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900">{currentPage}</h1>
      </div>
      </div>

    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState("Map");

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-row">
        <main className="flex-1 ml-0 md:ml-0 transition-all duration-300 ">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {children}
        </main>
      </body>
    </html>
  );
}
