"use client";
import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { Calendar, TrendingUp, Package } from "lucide-react";

const OrdersList = ({ marketId, refreshTrigger }: { marketId: string, refreshTrigger?: number }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

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
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900 border border-gray-300">
                        <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                        Pending
                    </span>
                );
            case 'won':
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900 border border-gray-300">
                        <span className="w-2 h-2 bg-black rounded-full" />
                        Won
                    </span>
                );
            case 'lost':
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900 border border-gray-300">
                        <span className="w-2 h-2 bg-black rounded-full" />
                        Lost
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-900 border border-gray-300">
                        <span className="w-2 h-2 bg-black rounded-full" />
                        {status}
                    </span>
                );
        }
    };

    // Get outcome badge
    const getOutcomeBadge = (outcome: string) => {
        if (outcome === 'Yes') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold bg-white text-gray-900 border border-gray-300">
                    <TrendingUp className="w-4 h-4" />
                    Yes
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold bg-gray-900 text-white border border-gray-900">
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    No
                </span>
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No Orders Yet</h3>
                <p className="text-sm text-gray-500">Orders placed on this market will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Your Orders</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((order) => (
                    <div 
                        key={order._id} 
                        className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Header with outcome and status */}
                        <div className="flex items-center justify-between mb-4">
                            {getOutcomeBadge(order.outcome)}
                            {getStatusBadge(order.status)}
                        </div>

                        {/* Order details */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                                <p className="text-2xl font-bold text-gray-900">${Number(order.amount).toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Placed on</p>
                                    <p className="text-sm font-medium text-gray-700">
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