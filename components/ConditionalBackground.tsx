"use client";
import { usePathname } from "next/navigation";
import CityBackground from "./CityBackground";

export default function ConditionalBackground() {
  const pathname = usePathname();
  
  // Only show background on landing page and auth pages
  const showBackground = pathname === "/" || pathname === "/login" || pathname === "/register";
  
  return showBackground ? <CityBackground /> : null;
}
