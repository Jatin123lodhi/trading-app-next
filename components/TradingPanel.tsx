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

const WalletSelect = ({ selectedWallet, setSelectedWallet }: { selectedWallet: string, setSelectedWallet: (wallet: string) => void }) => {
    const [wallets, setWallets] = useState<{ _id: string, balance: number, currency: string }[]>([]);
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
            const response = await fetch(`/api/market/${market._id}`, {
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

        const response = await fetch("/api/market", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data.data;
    }

    return (
        <div className="border p-4 rounded-md">
            {user?.role === 'user' ? <div>
                <h3 className="font-bold mb-4">Place Your Bet</h3>
                <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mb-4"
                />
                <div className="mb-4">
                    <WalletSelect selectedWallet={selectedWallet} setSelectedWallet={setSelectedWallet} />
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleOrder("Yes")}
                        disabled={loading || !amount || !selectedWallet}
                        className="flex-1 cursor-pointer"
                    >
                        Buy Yes
                    </Button>
                    <Button
                        onClick={() => handleOrder("No")}
                        disabled={loading || !amount || !selectedWallet}
                        variant="outline"
                        className="flex-1 cursor-pointer"
                    >
                        Buy No
                    </Button>
                </div>
            </div> : market.status === 'closed' ? <div>
                <h3 className="font-bold mb-4">Market is closed</h3>

            </div> : <div>
                <div className="flex gap-2">
                    <Button className="cursor-pointer" onClick={() => handleSettleMarket("No")}>Settle Market with No</Button>
                    <Button className="cursor-pointer" onClick={() => handleSettleMarket("Yes")}>Settle Market with Yes</Button>
                </div>
            </div>}
            {/* client component to show the orders */}
            <OrdersList marketId={market._id} refreshTrigger={refreshOrders} />
        </div>
    );
}