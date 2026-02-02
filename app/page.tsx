"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative bg-background text-foreground h-screen w-screen overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center h-screen disable-selection max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
              TrueSplit
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A set of beautifully designed prediction markets that you can trade on, 
              analyze, and profit from. Start here then make it your own.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/login" prefetch={true}>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 rounded-md px-6 py-2.5
                  transition-all duration-200 font-medium cursor-pointer text-sm"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/register" prefetch={true}>
              <Button 
                className="bg-transparent text-foreground border border-border hover:bg-muted 
                  rounded-md px-6 py-2.5 transition-all duration-200 font-medium cursor-pointer text-sm
                  hover:text-foreground"
              >
                View Markets
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
