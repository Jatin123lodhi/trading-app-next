"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import OrdersList from "./OrdersList";
import { useQuery } from "@tanstack/react-query";

import type { Wallet } from "@/types";

const WalletSelect = ({ selectedWallet, setSelectedWallet }: { selectedWallet: string, setSelectedWallet: (wallet: string) => void }) => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    useEffect(() => {
        const fetchWallets = async () => {
            const response = await fetch("/api/wallets", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setWallets(data.data);
        }
        fetchWallets();
    }, []);
    return (
        <Select value={selectedWallet} onValueChange={setSelectedWallet}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a wallet" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Wallets</SelectLabel>
                    {wallets.map((wallet) => (
                        <SelectItem key={wallet._id} value={wallet._id}>{wallet.currency}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default function TradingPanel({ market }: { market: { _id: string, title: string, description: string, category: string, endDate: Date, winningOutcome: string, status: "open" | "closed" | "settled" } }) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState("");
    const [user, setUser] = useState<{ email: string, role: string, userId: string } | null>(null);
    const [refreshOrders, setRefreshOrders] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setUser(data.data);
        }
        fetchUser();
    }, []);

    const handleOrder = async (outcome: "Yes" | "No") => {
        setLoading(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    marketId: market._id,
                    amount: parseFloat(amount),
                    outcome,
                    walletId: selectedWallet
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            // need to fetch orders list which in parent component
            setAmount("");
            setSelectedWallet("");
            setRefreshOrders(prev => prev + 1); // Trigger orders refresh
            toast.success("Order placed!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const handleSettleMarket = async (winningOutcome: "Yes" | "No") => {
        try {
            const response = await fetch(`/api/markets/${market._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ winningOutcome })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            toast.success("Market settled!");
            router.push("/dashboard");
            fetchMarkets();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to settle market");
        }
    }

    const fetchMarkets = async () => {

        const response = await fetch("/api/markets", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data.data;
    }

    // const {} = useQuery({
    //     queryKey: ['markets'],
    //     queryFn: () => {

    //     }
    // })



    return (
        <div className="space-y-6">
            {user?.role === 'user' ? (
                <div>
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Place Your Bet</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount
                            </label>
                            <Input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Wallet
                            </label>
                            <WalletSelect selectedWallet={selectedWallet} setSelectedWallet={setSelectedWallet} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button
                                onClick={() => handleOrder("Yes")}
                                disabled={loading || !amount || !selectedWallet}
                                variant="outline"
                                className="w-full cursor-pointer bg-white hover:bg-gray-50 text-gray-900 border-gray-300 font-semibold py-3"
                            >
                                {loading ? "Processing..." : "Buy Yes"}
                            </Button>
                            <Button
                                onClick={() => handleOrder("No")}
                                disabled={loading || !amount || !selectedWallet}
                                className="w-full cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3"
                            >
                                {loading ? "Processing..." : "Buy No"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : market.status === 'closed' ? (
                <div className="text-center py-4">
                    <h3 className="font-bold text-lg text-gray-700">Market is Closed</h3>
                    <p className="text-sm text-gray-500 mt-2">Awaiting settlement by admin</p>
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Settle Market</h3>
                    <p className="text-sm text-gray-600 mb-4">Choose the winning outcome to settle this market:</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3" 
                            onClick={() => handleSettleMarket("No")}
                        >
                            Settle with No
                        </Button>
                        <Button 
                            variant="outline"
                            className="cursor-pointer bg-white hover:bg-gray-50 text-gray-900 border-gray-300 font-semibold py-3" 
                            onClick={() => handleSettleMarket("Yes")}
                        >
                            Settle with Yes
                        </Button>
                    </div>
                </div>
            )}
            
            {/* Orders List */}
            <div className="pt-6 border-t border-gray-200">
                <OrdersList marketId={market._id} refreshTrigger={refreshOrders} />
            </div>
        </div>
    );
}