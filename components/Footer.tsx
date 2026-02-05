"use client";
import Link from "next/link";
import { Twitter, Github, Linkedin, Mail, Facebook, Instagram, TrendingUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-full bg-background dark:bg-background border-t border-border mt-auto overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">TrueSplit</h3>
            </div>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground leading-relaxed">
              A set of beautifully designed prediction markets that you can trade on, 
              analyze, and profit from. Start here then make it your own.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-muted/50 dark:hover:bg-muted/30"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Markets
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Trading Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Market Analysis
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-foreground">Company</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground dark:text-muted-foreground text-center md:text-left">
              © {currentYear} TrueSplit. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground dark:text-muted-foreground">
              <a
                href="#"
                className="hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>

        {/* Submerged TrueSplit Text */}
        <div className="relative overflow-hidden">
          <div className="relative flex items-center justify-center py-12">
            <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-bold text-foreground/5 dark:text-foreground/10 select-none pointer-events-none tracking-tight">
              TrueSplit
            </h2>
          </div>
        </div>

        
      </div>
    </footer>
  );
}
