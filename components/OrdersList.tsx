"use client";
import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { Calendar, TrendingUp, Package } from "lucide-react";

const OrdersList = ({ marketId, refreshTrigger }: { marketId: string, refreshTrigger?: number }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Get currency symbol based on wallet currency
    const getCurrencySymbol = (walletId: string | { _id: string; currency: string }) => {
        if (typeof walletId === 'object' && walletId.currency) {
            return walletId.currency === 'USD' ? '$' : '₹';
        }
        return '$'; // Default fallback
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/orders?marketId=${marketId}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                setOrders(data.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [marketId, refreshTrigger]);

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-card text-primary border border-border">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        Pending
                    </span>
                );
            case 'won':
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-card text-primary border border-border">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Won
                    </span>
                );
            case 'lost':
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-card text-primary border border-border">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Lost
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-card text-primary border border-border">
                        <span className="w-2 h-2 bg-primary rounded-full capitalize" />
                        <span className="capitalize">{status}</span>
                    </span>
                );
        }
    };

    // Get outcome badge
    const getOutcomeBadge = (outcome: string) => {
        if (outcome === 'Yes') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold bg-card text-primary border border-border">
                    <TrendingUp className="w-4 h-4" />
                    Yes
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold bg-primary text-primary-foreground border border-primary">
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    No
                </span>
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-muted rounded-lg border-2 border-dashed border-border">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-primary mb-1">No Orders Yet</h3>
                <p className="text-sm text-muted-foreground">Orders placed on this market will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Your Orders</h3>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((order) => (
                    <div 
                        key={order._id} 
                        className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Header with outcome and status */}
                        <div className="flex items-center justify-between mb-4">
                            {getOutcomeBadge(order.outcome)}
                            {getStatusBadge(order.status)}
                        </div>

                        {/* Order details */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
                                <p className="text-2xl font-bold text-primary">
                                    {getCurrencySymbol(order.walletId)}{Number(order.amount).toFixed(2)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-border">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Placed on</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrdersList;