"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SimpleHeader() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  // Initialize as false to match server render, will update after mount
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMounted(true);
  };

  // Remove unnecessary mounted state effect
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent px-4">
      <div className="container mx-auto px-2 sm:px-4 pt-2">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="text-base sm:text-lg font-bold">
            <Link href="/">TrueSplit</Link>
          </Button>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-6">
            <nav className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/login"
                className={`text-sm lg:text-base font-medium transition-colors ${
                  pathname === "/login" 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`text-sm lg:text-base font-medium transition-colors ${
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

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 text-muted-foreground hover:bg-card hover:text-primary cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md font-medium transition-colors ${
                  pathname === "/login" 
                    ? "text-primary bg-card" 
                    : "text-muted-foreground hover:text-primary hover:bg-card"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md font-medium transition-colors ${
                  pathname === "/register" 
                    ? "text-primary bg-card" 
                    : "text-muted-foreground hover:text-primary hover:bg-card"
                }`}
              >
                Register
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
