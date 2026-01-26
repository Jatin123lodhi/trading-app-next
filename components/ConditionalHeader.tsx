"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
    const pathname = usePathname();
    
    // Don't show header on landing, login, and register pages
    const hideHeaderRoutes = ["/", "/login", "/register"];
    
    if (hideHeaderRoutes.includes(pathname)) {
        return null;
    }
    
    return <Header />;
}
