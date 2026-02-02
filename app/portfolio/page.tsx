"use client";
import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type InfinitePortfolioData = {
    overview: {
        totalPortfolioValue: number;
        totalBalance: number;
        totalLockedBalance: number;
        totalPnL: number;
        winRate: number;
        totalOrders: number;
        wonOrders: number;
        lostOrders: number;
        pendingOrders: number;
    } | null;
    orders: Array<{
        _id: string;
        amount: number;
        outcome: string;
        status: string;
        createdAt: string;
        marketId: string | { _id: string; title: string; status: string };
        walletId: string | { _id: string; currency: string };
    }>;
    wallets: Array<{
        _id: string;
        balance: number;
        lockedBalance: number;
        currency: string;
    }>;
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
};

const PortfolioPage = () => {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useInfiniteQuery<InfinitePortfolioData>({
        queryKey: ['portfolio-infinite'],
        queryFn: ({ pageParam = 1 }) => 
            apiClient<InfinitePortfolioData>(`/api/user/portfolio?page=${pageParam}&limit=10`),
        getNextPageParam: (lastPage) => 
            lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
        initialPageParam: 1
    });

    // Extract data from pages
    const portfolioOverview = data?.pages[0]?.overview;
    const wallets = data?.pages[0]?.wallets || [];
    const allOrders = data?.pages.flatMap(page => page.orders) || [];

    // Infinite scroll effect
    useEffect(() => {
        const currentRef = loadMoreRef.current;
        
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px' // Start loading 100px before the element comes into view
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-white p-6 pt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-1/4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-muted rounded"></div>
                            ))}
                        </div>
                        <div className="h-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background text-white p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-red-500 text-lg font-semibold">Error loading portfolio</div>
                        <p className="text-muted-foreground mt-2">Please try refreshing the page</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !portfolioOverview) {
        return (
            <div className="min-h-screen bg-background text-white p-6 pt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-red-500 text-lg font-semibold">Error loading portfolio</div>
                        <p className="text-muted-foreground mt-2">Please try refreshing the page</p>
                    </div>
                </div>
            </div>
        );
    }

    const getCurrencySymbol = (currency: string) => currency === 'USD' ? '$' : '₹';
    
    const getStatusBadge = (status: string) => {
        return (
            <Badge 
                variant="outline" 
                className="text-primary border-border"
            >
                {status.toUpperCase()}
            </Badge>
        );
    };

    const getOutcomeBadge = (outcome: string) => {
        return (
            <Badge 
                variant="outline"
                className="text-primary border-border"
            >
                {outcome}
            </Badge>
        );
    };

    return (
        <div className="min-h-screen bg-background text-white p-6 pt-20">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                    <h1 className="text-3xl font-bold text-primary">Portfolio</h1>
                    <p className="text-muted-foreground mt-2">Track your trading performance and manage your investments</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Total Portfolio</div>
                        <div className="text-xl font-bold text-primary">
                            ₹{portfolioOverview.totalPortfolioValue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Available + Locked funds (converted to INR)
                        </p>
                    </div>

                    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Total P&L</div>
                        <div className="text-xl font-bold text-primary">
                            {portfolioOverview.totalPnL >= 0 ? '+' : ''}₹{portfolioOverview.totalPnL.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Realized gains/losses (in INR)
                        </p>
                    </div>

                    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Win Rate</div>
                        <div className="text-xl font-bold text-primary">{portfolioOverview.winRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {portfolioOverview.wonOrders}/{portfolioOverview.wonOrders + portfolioOverview.lostOrders} successful trades
                        </p>
                    </div>

                    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Active Orders</div>
                        <div className="text-xl font-bold text-primary">{portfolioOverview.pendingOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting settlement
                        </p>
                    </div>
                </div>

                {/* Wallets Section */}
                <Card className="bg-card shadow-md border border-border">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-primary">
                            Wallets
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Individual wallet balances shown in original currency
                        </p>
                    </CardHeader>
                    <CardContent>
                        {wallets.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No wallets found</p>
                                <p className="text-sm text-muted-foreground mt-1">Create a wallet to start trading</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {wallets.map((wallet) => (
                                    <div key={wallet._id} className="p-4 border border-border rounded-lg bg-muted hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-semibold text-lg text-primary">{wallet.currency}</span>
                                            <Badge variant="outline" className="text-primary border-border">
                                                {wallet.currency}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Available:</span>
                                                <span className="font-semibold text-primary">
                                                    {getCurrencySymbol(wallet.currency)}{wallet.balance.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Locked:</span>
                                                <span className="font-semibold text-primary">
                                                    {getCurrencySymbol(wallet.currency)}{wallet.lockedBalance.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t border-border">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-primary">Total:</span>
                                                    <span className="font-bold text-primary">
                                                        {getCurrencySymbol(wallet.currency)}{(wallet.balance + wallet.lockedBalance).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="bg-card shadow-md border border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-primary">Recent Orders</span>
                            <Badge variant="outline" className="text-primary border-border">
                                {allOrders.length} loaded
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {allOrders.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No orders found</p>
                                <p className="text-sm text-muted-foreground mt-1">Start trading to see your orders here</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {allOrders.map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted hover:shadow-md transition-all duration-200">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-primary mb-1">
                                                {typeof order.marketId === 'object' && order.marketId ? order.marketId.title : 'Market not found'}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                {getOutcomeBadge(order.outcome)}
                                                <span>•</span>
                                                <span className="font-medium">
                                                    {getCurrencySymbol(typeof order.walletId === 'object' ? order.walletId.currency : 'INR')}{order.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {getStatusBadge(order.status)}
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Infinite Scroll Trigger */}
                                {hasNextPage && (
                                    <div 
                                        ref={loadMoreRef}
                                        className="text-center pt-6 border-t border-border"
                                    >
                                        {isFetchingNextPage ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                <span className="text-sm text-muted-foreground">Loading more orders...</span>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                {allOrders.length} orders loaded • Scroll for more
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PortfolioPage;