"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string, role: string, userId: string } | null>(null);
    const [markets, setMarkets] = useState<{ _id: string, title: string, description: string, category: string, endDate: Date, winningOutcome: string }[]>([]);
    const [wallets, setWallets] = useState<{ _id: string, balance: number, currency: string }[]>([]);
    // fetch user details
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            setUser(data.data as { email: string, role: string, userId: string });
        };
        fetchUser();
    }, []);

    // handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    // fetch markets
    const fetchMarkets = async () => {
        try {
            const response = await fetch("/api/market");
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log(data.data);
            setMarkets(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMarkets();
    }, [user]);

    // fetch wallets
    const fetchWallets = async () => {
        const response = await fetch(`/api/wallets`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        console.log(data.data);
        setWallets(data.data);
    };

    useEffect(() => {
        fetchWallets();
    }, [user]);

    return (
        <div>
            <header className="border p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Trading App</h1>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">Welcome, {user?.email}</p>
                    <Button variant="outline" className="cursor-pointer" onClick={handleLogout}>Logout</Button>
                </div>
            </header>

            {/* wallet balance */}
            <div className="border p-4 rounded-md">
                <h2 className="text-lg font-bold mb-2">Wallet Balance</h2>
                <div className="flex gap-2">
                    {wallets.map((wallet) => (
                        <div className="border p-4 rounded-md flex-1" key={wallet._id}>
                            <p className="text-sm text-gray-500">Balance: {wallet.balance}</p>
                            <p className="text-sm text-gray-500">Currency: {wallet.currency}</p>
                        </div>
                    ))}
                </div>
            </div>


            <main className="border p-4">
                <div className="flex flex-col gap-2">
                    {markets.map((market) => (
                        <div onClick={() => router.push(`/market/${market._id}`)} className="border p-4 rounded-md cursor-pointer hover:bg-gray-100" key={market._id}>
                            <h2 className="text-lg font-bold">{market.title}</h2>
                            <p className="text-sm text-gray-500"> Description: {market.description}</p>
                            <p className="text-sm text-gray-500"> Category: {market.category}</p>
                            <p className="text-sm text-gray-500"> End Date: {new Date(market.endDate).toLocaleDateString()}</p>
                            {market.winningOutcome && <p className="text-sm text-gray-500"> Winning Outcome: {market.winningOutcome}</p>}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Dashboard;