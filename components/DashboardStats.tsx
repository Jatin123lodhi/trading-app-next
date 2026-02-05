"use client";

import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";

interface DashboardStatsProps {
    totalMarkets: number;
    openMarkets: number;
    totalVolume: number;
    hotMarkets: number;
}

export default function DashboardStats({
    totalMarkets,
    openMarkets,
    totalVolume,
    hotMarkets,
}: DashboardStatsProps) {
    const stats = [
        {
            icon: Activity,
            label: "Total Markets",
            value: totalMarkets,
            iconBgClass: "bg-muted",
            iconColorClass: "text-primary",
            hoverEffect: true,
        },
        {
            icon: TrendingUp,
            label: "Active Markets",
            value: openMarkets,
            iconBgClass: "bg-emerald-600",
            iconColorClass: "text-white",
        },
        {
            icon: DollarSign,
            label: "Total Volume",
            value: `₹${totalVolume.toLocaleString()}`,
            iconBgClass: "bg-muted",
            iconColorClass: "text-primary",
        },
        {
            icon: Users,
            label: "Hot Markets",
            value: hotMarkets,
            iconBgClass: "bg-gradient-to-r from-rose-500 to-pink-600",
            iconColorClass: "text-white",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    iconBgClass={stat.iconBgClass}
                    iconColorClass={stat.iconColorClass}
                    hoverEffect={stat.hoverEffect}
                />
            ))}
        </div>
    );
}
