"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SimpleHeader() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  // Initialize as false to match server render, will update after mount
  const [mounted, setMounted] = useState(false);

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMounted(true);
  };

  // Remove unnecessary mounted state effect
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent px-4 ">
      <div className="container mx-auto px-4 pt-2 flex items-center justify-between">
        
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">TrueSplit</Link>
        </Button>
        
        {/* Right side - Login, Register links and Dark mode toggle */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors ${
                pathname === "/login" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`text-sm font-medium transition-colors ${
                pathname === "/register" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Register
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleThemeToggle()}
            className="h-8 w-8 text-muted-foreground hover:bg-card hover:text-primary cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
