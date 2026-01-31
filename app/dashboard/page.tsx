"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Market, User } from "@/types";
import { Search, TrendingUp, Users, DollarSign, Activity, Filter, Clock, Target, BarChart3 } from "lucide-react";

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
        // Create mock data based on current markets for demonstration
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
    }, [dashboardStats]);

    const chartConfig = {
        volume: {
            label: "Volume (₹)",
            color: "hsl(var(--chart-1))",
        },
    };



    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-6 max-w-7xl mx-auto space-y-8">
                {/* Dashboard Header */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">Trading Dashboard</h1>
                            <p className="text-gray-600 text-lg">Discover and trade on prediction markets</p>
                        </div>
                        {user?.role === 'admin' && (
                            <Button 
                                onClick={() => router.push("/create-market")} 
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white border-0 px-8 py-3 rounded-lg shadow-sm"
                            >
                                <Target className="w-4 h-4 mr-2" />
                                Create Market
                            </Button>
                        )}
                    </div>

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-700 rounded-xl shadow-sm">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Total Markets</p>
                                        <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalMarkets}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-600 rounded-xl shadow-sm">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-emerald-700 font-medium">Active Markets</p>
                                        <p className="text-2xl font-bold text-emerald-900">{dashboardStats.openMarkets}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-slate-100">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-700 rounded-xl shadow-sm">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 font-medium">Total Volume</p>
                                        <p className="text-2xl font-bold text-slate-900">₹{dashboardStats.totalVolume.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-pink-100">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow-sm">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-rose-700 font-medium">Hot Markets</p>
                                        <p className="text-2xl font-bold text-rose-900">{dashboardStats.hotMarkets}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Market Volume Chart Section */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-800 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Market Volume Trends</h2>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-0">
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
                {trendingMarkets.length > 0 && (
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Trending Markets</h2>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-0">
                                Top Volume
                            </Badge>
                        </div>
                        <div className="relative overflow-hidden py-1">
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: false,
                                    containScroll: "trimSnaps",
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-4">
                                    {trendingMarkets.map((market) => {
                                        const totalBets = market.totalBetAmount.yes + market.totalBetAmount.no;
                                        const yesProb = totalBets > 0 ? Math.round((market.totalBetAmount.yes / totalBets) * 100) : 50;
                                        
                                        return (
                                            <CarouselItem key={market._id} className="pl-4 basis-full md:basis-[45%] lg:basis-[38%] py-1">
                                            <Card 
                                                onClick={() => router.push(`/market/${market._id}`)} 
                                                className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-gray-300 h-56 flex flex-col"
                                            >
                                                <CardContent className="px-4 pt-4 pb-5 flex flex-col h-full justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <Badge variant="outline" className="text-xs bg-gray-800 text-white border-0 px-2 py-1">
                                                                TRENDING
                                                            </Badge>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500 font-medium">Volume</p>
                                                                <p className="text-sm font-bold text-gray-900">₹{totalBets.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-sm leading-tight">
                                                            {market.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                            {market.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-3">
                                                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                                                            {market.category}
                                                        </Badge>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500 font-medium">YES</p>
                                                            <p className="text-base font-bold text-emerald-600">{yesProb}%</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                            </Carousel>
                        </div>
                    </div>
                )}

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-lg">
                                <Filter className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">All Markets</h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search Input */}
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search markets by title, description, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-4 py-3 border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 rounded-lg shadow-sm"
                                />
                            </div>
                            
                            {/* Category Filter */}
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full sm:w-48 border-gray-200 py-3 rounded-lg shadow-sm">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category.toLowerCase()}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {/* Status Filter */}
                            <Select value={status} onValueChange={(value) => setStatus(value as "open" | "closed" | "settled")}>
                                <SelectTrigger className="w-full sm:w-32 border-gray-200 py-3 rounded-lg shadow-sm">
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
                        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                            {searchQuery && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-2">
                                    Search: &quot;{searchQuery}&quot;
                                    <button 
                                        onClick={() => setSearchQuery("")}
                                        className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {selectedCategory !== "all" && (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-2">
                                    Category: {categories.find(c => c.toLowerCase() === selectedCategory) || selectedCategory}
                                    <button 
                                        onClick={() => setSelectedCategory("all")}
                                        className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
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
                                <Card key={i} className="animate-pulse border border-gray-200">
                                    <CardContent className="p-5">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    ) : filteredMarkets.length > 0 ? (
                        filteredMarkets.map((market) => {
                            const totalBets = market.totalBetAmount.yes + market.totalBetAmount.no;
                            const yesProb = totalBets > 0 ? Math.round((market.totalBetAmount.yes / totalBets) * 100) : 50;
                            const noProb = totalBets > 0 ? Math.round((market.totalBetAmount.no / totalBets) * 100) : 50;
                            const isLive = market.status === 'open';
                            const isHot = totalBets > (dashboardStats.totalVolume / dashboardStats.totalMarkets);
                            
                            return (
                                <Card 
                                    key={market._id}
                                    onClick={() => router.push(`/market/${market._id}`)} 
                                    className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white hover:scale-[1.02] group"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex gap-2">
                                            <Badge 
                                                variant={isLive ? "default" : "secondary"} 
                                                className={`text-xs ${isLive ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {market.status.toUpperCase()}
                                            </Badge>
                                            {isHot && (
                                                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-900 border-gray-300">
                                                    HOT
                                                </Badge>
                                            )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(market.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
                                            {market.title}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {market.description}
                                        </p>
                                    </CardHeader>
                                    
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                {market.category}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Total Volume</p>
                                                <p className="text-sm font-bold text-gray-900">₹{totalBets.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        
                                        {market.winningOutcome && (
                                            <div className="mb-4 p-2 bg-gray-100 rounded-lg border border-gray-300">
                                                <p className="text-sm text-gray-900 font-semibold">
                                                    Winner: {market.winningOutcome}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Betting Stats */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-gray-900">YES</span>
                                                    <span className={`text-xs font-semibold text-gray-700 ${isLive ? 'animate-pulse' : ''}`}>
                                                        {yesProb}%
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 mt-1">
                                                    ₹{market.totalBetAmount.yes.toLocaleString()}
                                                </p>
                                            </div>
                                            
                                            <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-gray-900">NO</span>
                                                    <span className={`text-xs font-semibold text-gray-700 ${isLive ? 'animate-pulse' : ''}`}>
                                                        {noProb}%
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 mt-1">
                                                    ₹{market.totalBetAmount.no.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="col-span-full">
                            <Card className="border border-gray-200">
                                <CardContent className="p-8 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Search className="w-12 h-12 text-gray-400" />
                                        <h3 className="text-lg font-semibold text-gray-900">No markets found</h3>
                                        <p className="text-gray-600">
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