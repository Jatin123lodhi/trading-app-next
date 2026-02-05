"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Users, Zap, Shield } from "lucide-react";
import type { Market } from "@/types";
import MarketCard from "@/components/MarketCard";

export default function Home() {

  const stats = [
    { icon: Users, value: "10K+", label: "Active Traders", delay: 0.2 },
    { icon: TrendingUp, value: "$2.5M+", label: "Volume Traded", delay: 0.4 },
    { icon: Zap, value: "<100ms", label: "Avg Latency", delay: 0.6 },
    { icon: Shield, value: "99.9%", label: "Uptime", delay: 0.8 },
  ];

  // Dummy featured markets data
  const featuredMarkets: Market[] = [
    {
      _id: "market-40",
      title: "Market 40: Will entertainment event happen in 2026?",
      description: "A prediction market where users can bet on whether an entertainment event will occur in 2026.",
      category: "entertainment",
      endDate: new Date("2026-03-15"),
      status: "open",
      winningOutcome: "",
      totalBetAmount: {
        yes: 32640,
        no: 24643
      }
    },
    {
      _id: "market-107",
      title: "Market 107: Will weather event happen in 2026?",
      description: "A prediction market where users can bet on whether a weather event will occur in 2026.",
      category: "weather",
      endDate: new Date("2026-04-28"),
      status: "open",
      winningOutcome: "",
      totalBetAmount: {
        yes: 29420,
        no: 43110
      }
    },
    {
      _id: "market-126",
      title: "Market 126: Will weather event happen in 2026?",
      description: "A prediction market where users can bet on whether a weather event will occur in 2026.",
      category: "weather",
      endDate: new Date("2026-04-07"),
      status: "open",
      winningOutcome: "",
      totalBetAmount: {
        yes: 2408,
        no: 20711
      }
    }
  ];

  // Calculate average volume for HOT badge
  const averageVolume = featuredMarkets.length > 0
    ? featuredMarkets.reduce((sum, m) => sum + m.totalBetAmount.yes + m.totalBetAmount.no, 0) / featuredMarkets.length
    : 0;

  return (
    <div className="relative bg-background text-foreground min-h-screen w-full overflow-x-hidden pb-12">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen disable-selection max-w-6xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 w-full"
        >
          {/* Main Heading with Stagger Animation */}
          <div className="space-y-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight text-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              TrueSplit
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A set of beautifully designed prediction markets that you can trade on, 
              analyze, and profit from. Start here then make it your own.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/login" prefetch={true}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 rounded-md px-8 py-3
                    transition-all duration-300 font-medium cursor-pointer text-base
                    hover:shadow-lg hover:shadow-primary/50 relative overflow-hidden group"
                >
                  <motion.span
                    className="relative z-10"
                    initial={false}
                    animate={{ x: 0 }}
                  >
                    Get Started
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </Link>
            <Link href="/register" prefetch={true}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  className="bg-transparent text-foreground border-2 border-border hover:bg-muted 
                    rounded-md px-8 py-3 transition-all duration-300 font-medium cursor-pointer text-base
                    hover:text-foreground hover:border-primary/50 hover:shadow-md relative overflow-hidden group"
                >
                  <motion.span
                    className="relative z-10"
                    initial={false}
                    animate={{ x: 0 }}
                  >
                    View Markets
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: stat.delay }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      delay: stat.delay,
                    }}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary mb-2" />
                  </motion.div>
                  <motion.div
                    className="text-2xl md:text-3xl font-bold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: stat.delay + 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          
        </motion.div>
      </div>

      {/* Featured Markets Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Featured Markets
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore trending prediction markets
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMarkets.map((market, index) => (
            <motion.div
              key={market._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MarketCard market={market} averageVolume={averageVolume} />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
