// Web version of SplashScreen using Tailwind CSS
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/map"); // Redirect to main page after splash
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ background: '#6EC800', minHeight: '100vh' }} className="flex flex-col items-center justify-center">
      <div style={{ color: '#fff' }} className="text-4xl font-bold mb-4">Wago Power Analyzer</div>
      <div style={{ background: '#fff' }} className="w-24 h-24 rounded-full flex items-center justify-center">
        <span style={{ color: '#6EC800' }} className="text-3xl font-bold">W</span>
      </div>
      <div style={{ color: '#fff' }} className="mt-8 animate-pulse">Loading...</div>
    </div>
  );
}
