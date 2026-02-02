"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { capitalizeCategory } from "@/lib/utils";
import type { Market, User } from "@/types";

type VolumeTrend = {
    day: string;
    date: string;
    volume: number;
    markets: number;
};
import { Search, TrendingUp, Users, DollarSign, Activity, Filter, Target, BarChart3 } from "lucide-react";
import StatCard from "@/components/StatCard";
import TrendingMarkets from "@/components/TrendingMarkets";
import MarketCard from "@/components/MarketCard";

const Dashboard = () => {
    const router = useRouter();
    const [status, setStatus] = useState<"open" | "closed" | "settled">("open");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");


    const {
        data: user
    } = useQuery<User>({
        queryKey: ['user'],
        queryFn: () => apiClient<User>('/api/auth/me')
    })

    const {
        data: markets = [],
        isLoading: loadingMarkets
    } = useQuery<Market[]>({
        queryKey: ["markets"], // unique key for this query
        queryFn: () => apiClient<Market[]>('/api/markets'), // function that fetches the data
        refetchInterval: status === 'open' ? 5000 : false, // auto polling when status is open
        enabled: !!user, // only run when user exists
    })

    // Fetch real volume trends data
    const {
        data: volumeTrends = [],
    } = useQuery<VolumeTrend[]>({
        queryKey: ["volume-trends"],
        queryFn: async () => {
            try {
                const response = await apiClient<{message: string, data: VolumeTrend[]}>('/api/analytics/weekly-volume');
                return response.data || [];
            } catch (error) {
                console.error('Error fetching volume trends:', error);
                return [];
            }
        },
        refetchInterval: 30000, // Refresh every 30 seconds
        enabled: !!user,
    })

    // Filter and search markets
    const filteredMarkets = useMemo(() => {
        let filtered = markets.filter((market) => market.status.toLowerCase() === status.toLowerCase());
        
        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter((market) =>
                market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                market.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply category filter
        if (selectedCategory !== "all") {
            filtered = filtered.filter((market) => market.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        
        return filtered;
    }, [markets, status, searchQuery, selectedCategory]);

    // Get unique categories for filter
    const categories = useMemo(() => {
        const cats = Array.from(new Set(markets.map(market => market.category)));
        return cats.sort();
    }, [markets]);

    // Calculate trending markets (top 6 by volume)
    const trendingMarkets = useMemo(() => {
        return markets
            .filter(market => market.status === 'open')
            .sort((a, b) => {
                const aTotal = a.totalBetAmount.yes + a.totalBetAmount.no;
                const bTotal = b.totalBetAmount.yes + b.totalBetAmount.no;
                return bTotal - aTotal;
            })
            .slice(0, 6);
    }, [markets]);

    // Calculate dashboard stats
    const dashboardStats = useMemo(() => {
        const openMarkets = markets.filter(m => m.status === 'open').length;
        const totalVolume = markets.reduce((sum, market) => 
            sum + market.totalBetAmount.yes + market.totalBetAmount.no, 0
        );
        const avgVolume = markets.length > 0 ? totalVolume / markets.length : 0;
        const hotMarkets = markets.filter(m => {
            const total = m.totalBetAmount.yes + m.totalBetAmount.no;
            return total > avgVolume && m.status === 'open';
        }).length;

        return {
            totalMarkets: markets.length,
            openMarkets,
            totalVolume,
            hotMarkets
        };
    }, [markets]);

    // Generate chart data for market volume trends
    const chartData = useMemo(() => {
        if (volumeTrends.length > 0) {
            // Use real volume data when available
            return volumeTrends.map(trend => ({
                day: trend.day,
                volume: trend.volume,
                markets: trend.markets || Math.max(1, Math.round(dashboardStats.openMarkets / 7))
            }));
        } else {
            // Fallback to mock data when no real data exists
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const variations = [0.8, 1.2, 0.9, 1.1, 1.3, 0.7, 1.0]; // Predefined variations
            return days.map((day, index) => {
                const baseVolume = dashboardStats.totalVolume / 7;
                const volume = Math.max(0, Math.round(baseVolume * variations[index]));
                return {
                    day,
                    volume,
                    markets: Math.max(1, Math.round(dashboardStats.openMarkets * variations[index]))
                };
            });
        }
    }, [volumeTrends, dashboardStats]);

    const chartConfig = {
        volume: {
            label: "Volume (₹)",
            color: "hsl(var(--chart-1))",
        },
    };



    return (
        <div className="min-h-screen bg-background text-white pt-20">
            <main className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Dashboard Header */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-primary mb-3">Trading Dashboard</h1>
                            <p className="text-muted-foreground text-lg">Discover and trade on prediction markets</p>
                        </div>
                        {user?.role === 'admin' && (
                            <Button 
                                onClick={() => router.push("/create-market")} 
                                className="cursor-pointer px-8 py-3 rounded-lg shadow-sm"
                            >
                                <Target className="w-4 h-4 mr-2" />
                                Create Market
                            </Button>
                        )}
                    </div>

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Activity,
                                label: "Total Markets",
                                value: dashboardStats.totalMarkets,
                                iconBgClass: "bg-muted",
                                iconColorClass: "text-primary",
                                hoverEffect: true,
                            },
                            {
                                icon: TrendingUp,
                                label: "Active Markets",
                                value: dashboardStats.openMarkets,
                                iconBgClass: "bg-emerald-600",
                                iconColorClass: "text-white",
                            },
                            {
                                icon: DollarSign,
                                label: "Total Volume",
                                value: `₹${dashboardStats.totalVolume.toLocaleString()}`,
                                iconBgClass: "bg-muted",
                                iconColorClass: "text-primary",
                            },
                            {
                                icon: Users,
                                label: "Hot Markets",
                                value: dashboardStats.hotMarkets,
                                iconBgClass: "bg-gradient-to-r from-rose-500 to-pink-600",
                                iconColorClass: "text-white",
                            },
                        ].map((stat, index) => (
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
                </div>

                {/* Market Volume Chart Section */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-muted rounded-lg">
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Market Volume Trends</h2>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                            Last 7 Days
                        </Badge>
                    </div>
                    <div className="h-80 w-full">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart
                                data={chartData}
                                width={800}
                                height={300}
                                margin={{
                                    left: 20,
                                    right: 20,
                                    top: 20,
                                    bottom: 20,
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
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
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

                {/* Trending Markets Section */}
                <TrendingMarkets markets={trendingMarkets} />

                {/* Search and Filter Section */}
                <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                                <Filter className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary">All Markets</h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search Input */}
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    placeholder="Search by title, description, or category"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-3 border-border focus:border-border focus:ring-2 focus:ring-ring rounded-lg shadow-sm"
                                />
                            </div>
                            
                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-48 border-border py-3 rounded-lg shadow-sm">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category.toLowerCase()}>
                                            {capitalizeCategory(category)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {/* Status Filter */}
                            <Select value={status} onValueChange={(value) => setStatus(value as "open" | "closed" | "settled")}>
                                <SelectTrigger className="w-full sm:w-24  border-border py-3 rounded-lg shadow-sm">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                    <SelectItem value="settled">Settled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || selectedCategory !== "all") && (
                        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                            {searchQuery && (
                                <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border px-3 py-2">
                                    Search: &quot;{searchQuery}&quot;
                                    <button 
                                        onClick={() => setSearchQuery("")}
                                        className="ml-2 text-muted-foreground hover:text-primary font-bold cursor-pointer"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {selectedCategory !== "all" && (
                                <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border px-3 py-1 flex items-center gap-2">
                                    <span>Category: {capitalizeCategory(categories.find(c => c.toLowerCase() === selectedCategory) || selectedCategory)}</span>
                                    <button 
                                        onClick={() => setSelectedCategory("all")}
                                        className=" text-lg text-muted-foreground hover:text-primary font-bold cursor-pointer"
                                    >
                                        ×
                                    </button> 
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                    {/* Markets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {loadingMarkets ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i} className="animate-pulse border border-border">
                                    <CardContent className="p-5">
                                        <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                                        <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
                                        <div className="h-4 bg-muted rounded w-full"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    ) : filteredMarkets.length > 0 ? (
                        filteredMarkets.map((market) => (
                            <MarketCard 
                                key={market._id}
                                market={market}
                                averageVolume={dashboardStats.totalMarkets > 0 ? dashboardStats.totalVolume / dashboardStats.totalMarkets : 0}
                            />
                        ))
                    ) : (
                        <div className="col-span-full">
                            <Card className="border border-border">
                                <CardContent className="p-8 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Search className="w-12 h-12 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold text-primary">No markets found</h3>
                                        <p className="text-muted-foreground">
                                            {searchQuery || selectedCategory !== "all" 
                                                ? "Try adjusting your search or filters" 
                                                : `No ${status} markets available at the moment`
                                            }
                                        </p>
                                        {(searchQuery || selectedCategory !== "all") && (
                                            <Button 
                                                variant="outline" 
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setSelectedCategory("all");
                                                }}
                                                className="mt-2"
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Dashboard;