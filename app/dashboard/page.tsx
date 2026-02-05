"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Market, User } from "@/types";

type VolumeTrend = {
    day: string;
    date: string;
    volume: number;
    markets: number;
};
import TrendingMarkets from "@/components/TrendingMarkets";
import MarketVolumeChart from "@/components/MarketVolumeChart";
import DashboardStats from "@/components/DashboardStats";
import DashboardHeader from "@/components/DashboardHeader";
import MarketFilters from "@/components/MarketFilters";
import MarketsGrid from "@/components/MarketsGrid";

const Dashboard = () => {
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

    return (
        <div className="min-h-screen bg-background text-white pt-16 sm:pt-20">
            <main className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
                {/* Dashboard Header */}
                <DashboardHeader userRole={user?.role} />

                {/* Dashboard Stats */}
                <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-border">
                    <DashboardStats
                        totalMarkets={dashboardStats.totalMarkets}
                        openMarkets={dashboardStats.openMarkets}
                        totalVolume={dashboardStats.totalVolume}
                        hotMarkets={dashboardStats.hotMarkets}
                    />
                </div>

                {/* Market Volume Chart Section */}
                <MarketVolumeChart
                    volumeTrends={volumeTrends}
                    totalVolume={dashboardStats.totalVolume}
                    openMarkets={dashboardStats.openMarkets}
                />

                {/* Trending Markets Section */}
                <TrendingMarkets markets={trendingMarkets} />

                {/* Search and Filter Section */}
                <MarketFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    status={status}
                    setStatus={setStatus}
                    categories={categories}
                />

                {/* Markets Grid */}
                <MarketsGrid
                    loadingMarkets={loadingMarkets}
                    filteredMarkets={filteredMarkets}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    status={status}
                    averageVolume={dashboardStats.totalMarkets > 0 ? dashboardStats.totalVolume / dashboardStats.totalMarkets : 0}
                    onClearFilters={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                    }}
                />
            </main>
        </div>
    )
}

export default Dashboard;