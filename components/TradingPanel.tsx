"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const WalletSelect = ({ wallets, selectedWallet, setSelectedWallet }: { wallets: { _id: string, balance: number, currency: string }[], selectedWallet: string, setSelectedWallet: (wallet: string) => void }) => {
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

export default function TradingPanel({ market }: { market: { _id: string, title: string, description: string, category: string, endDate: Date, winningOutcome: string } }) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [wallets, setWallets] = useState<{ _id: string, balance: number, currency: string }[]>([]);
    const [selectedWallet, setSelectedWallet] = useState("");

    const handleOrder = async (outcome: "yes" | "no") => {
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
            toast.success("Order placed!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const fetchWallets = async () => {
        try {
            const response = await fetch("/api/wallets", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            console.log(data.data);
            setWallets(data.data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to fetch wallets");
        }
    };

    useEffect(() => {
        fetchWallets();
    }, [market]);

    return (
        <div className="border p-4 rounded-md">
            <h3 className="font-bold mb-4">Place Your Bet</h3>
            <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mb-4"
            />
            <div className="mb-4">
                <WalletSelect wallets={wallets} selectedWallet={selectedWallet} setSelectedWallet={setSelectedWallet} />
            </div>
            <div className="flex gap-2">
                <Button
                    onClick={() => handleOrder("yes")}
                    disabled={loading || !amount}
                    className="flex-1"
                >
                    Buy YES
                </Button>
                <Button
                    onClick={() => handleOrder("no")}
                    disabled={loading || !amount}
                    variant="outline"
                    className="flex-1"
                >
                    Buy NO
                </Button>
            </div>
        </div>
    );
}