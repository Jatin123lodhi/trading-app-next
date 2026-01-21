"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative text-white h-screen w-screen overflow-hidden" style={{ cursor: 'crosshair' }}>
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen disable-selection">
        <div className="bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl p-12 rounded-2xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-extrabold mb-4 text-center tracking-tight"
          >
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              PredictX
            </span>
          </motion.h1>
         
          <p className="text-xl my-8 text-center text-gray-300 animate-fade-in animation-delay-200">
            Binary Prediction Trading Platform
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/login" prefetch={true}>
              <Button 
                className="hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 
                  transition-all duration-300 cursor-pointer bg-black hover:bg-red-900/40 
                  border border-white/10 rounded-full px-6"
              >
                Login
              </Button>
            </Link>
            <Link href="/register" prefetch={true}>
              <Button 
                className="hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 
                  transition-all duration-300 cursor-pointer bg-black hover:bg-red-900/40 
                  border border-white/10 rounded-full px-6"
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
