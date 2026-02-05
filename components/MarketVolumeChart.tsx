"use client";

import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";

type VolumeTrend = {
    day: string;
    date: string;
    volume: number;
    markets: number;
};

interface MarketVolumeChartProps {
    volumeTrends: VolumeTrend[];
    totalVolume: number;
    openMarkets: number;
}

export default function MarketVolumeChart({
    volumeTrends,
    totalVolume,
    openMarkets,
}: MarketVolumeChartProps) {
    // Generate chart data for market volume trends
    const chartData = useMemo(() => {
        if (volumeTrends.length > 0) {
            // Use real volume data when available
            return volumeTrends.map(trend => ({
                day: trend.day,
                volume: trend.volume,
                markets: trend.markets || Math.max(1, Math.round(openMarkets / 7))
            }));
        } else {
            // Fallback to mock data when no real data exists
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const variations = [0.8, 1.2, 0.9, 1.1, 1.3, 0.7, 1.0]; // Predefined variations
            return days.map((day, index) => {
                const baseVolume = totalVolume / 7;
                const volume = Math.max(0, Math.round(baseVolume * variations[index]));
                return {
                    day,
                    volume,
                    markets: Math.max(1, Math.round(openMarkets * variations[index]))
                };
            });
        }
    }, [volumeTrends, totalVolume, openMarkets]);

    const chartConfig = {
        volume: {
            label: "Volume (₹)",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-primary">Market Volume Trends</h2>
                </div>
                <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 w-fit">
                    Last 7 Days
                </Badge>
            </div>
            <div className="h-64 sm:h-72 md:h-80 w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <ChartContainer config={chartConfig} className="h-full w-full min-w-[500px] sm:min-w-0">
                    <AreaChart
                        data={chartData}
                        width={undefined}
                        height={undefined}
                        margin={{
                            left: 5,
                            right: 5,
                            top: 10,
                            bottom: 10,
                        }}
                    >
                        <defs>
                            <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                                if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
                                if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                                return `₹${value}`;
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Area
                            dataKey="volume"
                            type="natural"
                            fill="url(#fillVolume)"
                            fillOpacity={0.4}
                            stroke="#6366f1"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    );
}
