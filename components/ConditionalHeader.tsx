"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import SimpleHeader from "./SimpleHeader";

export default function ConditionalHeader() {
    const pathname = usePathname();
    
    // Show simple header on landing, login, and register pages
    const simpleHeaderRoutes = ["/", "/login", "/register"];
    
    if (simpleHeaderRoutes.includes(pathname)) {
        return <SimpleHeader />;
    }
    
    return <Header />;
}
