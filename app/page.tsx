"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-black text-white h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-screen">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold"
        >
          Trading App
        </motion.h1>
        <p className="text-xl my-8 animate-fade-in animation-delay-200">Welcome to the trading app</p>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/login")} className="hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 
             transition-all duration-300 cursor-pointer">Login</Button>
          <Button onClick={() => router.push("/register")} className="hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 
             transition-all duration-300 cursor-pointer">Register</Button>
        </div>
      </div>
    </div>
  );
}
