"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Market, User } from "@/types";

const Dashboard = () => {
    const router = useRouter();
    const [status, setStatus] = useState<"open" | "closed" | "settled">("open");


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



    return (
        <div className="min-h-screen bg-gray-50">
            <main className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Markets</h2>
                    <div className="flex items-center gap-2">
                        {/* a button to create a new market only admin can see  */}
                        {user?.role === 'admin' && <Button onClick={() => router.push("/create-market")} className="cursor-pointer bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0">Create Market</Button>}
                        <Select value={status} onValueChange={(value) => setStatus(value as "open" | "closed" | "settled")}>
                            <SelectTrigger className="cursor-pointer">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="settled">Settled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {loadingMarkets ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="border p-5 rounded-lg animate-pulse bg-white">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))}
                        </>
                    ) : markets.filter((market) => market.status.toLowerCase() === status.toLowerCase()).length > 0 ? (
                        markets.filter((market) => market.status.toLowerCase() === status.toLowerCase()).map((market) => {
                            const totalBets = market.totalBetAmount.yes + market.totalBetAmount.no;
                            const yesProb = totalBets > 0 ? Math.round((market.totalBetAmount.yes / totalBets) * 100) : 50;
                            const noProb = totalBets > 0 ? Math.round((market.totalBetAmount.no / totalBets) * 100) : 50;
                            const isLive = market.status === 'open';
                            
                            return (
                                <div 
                                    onClick={() => router.push(`/market/${market._id}`)} 
                                    className="bg-white border border-gray-200 p-5 rounded-lg cursor-pointer hover:shadow-lg hover:border-pink-300 transition-all duration-200 flex flex-col relative" 
                                    key={market._id}
                                >
                                    <h2 className="text-lg font-bold text-gray-800 mb-2 truncate pr-16" title={market.title}>
                                        {market.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                                        <span className="font-semibold">Description:</span> {market.description}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1 truncate">
                                        <span className="font-semibold">Category:</span> {market.category}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="font-semibold">End Date:</span> {new Date(market.endDate).toLocaleDateString()}
                                    </p>
                                    {market.winningOutcome && (
                                        <p className="text-sm text-green-600 font-semibold mt-2 truncate" title={market.winningOutcome}>
                                            Winning Outcome: {market.winningOutcome}
                                        </p>
                                    )}
                                    
                                    {/* Live Betting Stats with Micro-interactions */}
                                    <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
                                        <div className="flex-1 px-3 py-2 rounded-md transition-all duration-300 bg-white hover:bg-gray-50 border border-gray-200">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-xs font-semibold text-gray-900">
                                                    <span>YES</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-sm font-bold text-gray-900`}>
                                                        ₹{market.totalBetAmount.yes}
                                                    </span>
                                                    <span className={`text-xs font-semibold text-gray-600 ${isLive ? 'animate-pulse' : ''}`}>
                                                        ({yesProb}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 px-3 py-2 rounded-md transition-all duration-300 bg-white hover:bg-gray-50 border border-gray-200">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-xs font-semibold text-gray-900">
                                                    <span>NO</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-sm font-bold text-gray-900`}>
                                                        ₹{market.totalBetAmount.no}
                                                    </span>
                                                    <span className={`text-xs font-semibold text-gray-600 ${isLive ? 'animate-pulse' : ''}`}>
                                                        ({noProb}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="col-span-full">
                            <p className="text-sm text-gray-500 text-center py-8">No markets found for this status.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Dashboard;