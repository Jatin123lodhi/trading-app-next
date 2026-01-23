"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string, role: string, userId: string } | null>(null);
    const [markets, setMarkets] = useState<{ _id: string, title: string, description: string, category: string, endDate: Date, winningOutcome: string, status: "open" | "closed" | "settled", totalBetAmount: { yes: number, no: number} }[]>([]);
    const [wallets, setWallets] = useState<{ _id: string, balance: number, currency: string, lockedBalance: number }[]>([]);
    const [status, setStatus] = useState<"open" | "closed" | "settled">("open");
    
    // Loading states
    const [loadingWallets, setLoadingWallets] = useState(true);
    const [loadingMarkets, setLoadingMarkets] = useState(true);
    
    // Wallet creation states
    const [showCreateWallet, setShowCreateWallet] = useState(false);
    const [newWalletCurrency, setNewWalletCurrency] = useState<"INR" | "USD">("INR");
    const [newWalletBalance, setNewWalletBalance] = useState("");
    const [creatingWallet, setCreatingWallet] = useState(false);
    
    // Add balance states
    const [addBalanceWalletId, setAddBalanceWalletId] = useState<string | null>(null);
    const [addBalanceAmount, setAddBalanceAmount] = useState("");
    const [addingBalance, setAddingBalance] = useState(false);

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
    const handleLogout = async () => {
        try{

            // call logout api
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            toast.success("Logged out successfully");
            localStorage.removeItem("token");
            router.push("/login");
        }catch(error){
            console.error("Logout error:", error)
            toast.error("Failed to logout");
            localStorage.removeItem("token");
            router.push("/login");
        }
    };

    // fetch markets
    const fetchMarkets = async (showLoading = true) => {
        if (showLoading) {
            setLoadingMarkets(true);
        }
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
        } finally {
            if (showLoading) {
                setLoadingMarkets(false);
            }
        }
    };

    // Initial fetch - show loading
    useEffect(() => {
        fetchMarkets(true);
    }, [user]);

    // Polling for real-time updates - NO loading state
    useEffect(() => {
        if(status !== 'open') return;
        const interval = setInterval(() => fetchMarkets(false), 5000);
        return () => clearInterval(interval);
    }, [status])

    // fetch wallets
    const fetchWallets = async () => {
        setLoadingWallets(true);
        try {
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
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingWallets(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, [user]);

    // create wallet
    const handleCreateWallet = async () => {
        setCreatingWallet(true);
        try {
            const response = await fetch("/api/wallets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    currency: newWalletCurrency,
                    balance: parseFloat(newWalletBalance)
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            toast.success("Wallet created successfully!");
            setShowCreateWallet(false);
            setNewWalletBalance("");
            setNewWalletCurrency("INR");
            fetchWallets(); // Refresh wallets list
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create wallet");
        } finally {
            setCreatingWallet(false);
        }
    };

    // add balance to wallet
    const handleAddBalance = async () => {
        if (!addBalanceWalletId) return;
        setAddingBalance(true);
        try {
            const response = await fetch(`/api/wallets/${addBalanceWalletId}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    amount: parseFloat(addBalanceAmount)
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            toast.success("Balance added successfully!");
            setAddBalanceWalletId(null);
            setAddBalanceAmount("");
            fetchWallets(); // Refresh wallets list
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add balance");
        } finally {
            setAddingBalance(false);
        }
    };

    // filter the markets by status open, closed, settled

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">PredictX</h1>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">Welcome, <span className="font-semibold text-gray-800">{user?.email}</span> <span className="text-xs text-gray-500">({user?.role})</span></p>
                    
                    <Button variant="outline" className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors" onClick={handleLogout}>Logout</Button>
                </div>
            </header>

            {/* wallet balance */}
            {user?.role === 'user' && <div className="bg-white border border-gray-200 p-6 rounded-lg m-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Wallet Balance</h2>
                    <Button onClick={() => setShowCreateWallet(!showCreateWallet)} className="cursor-pointer">
                        {showCreateWallet ? "Cancel" : "Create Wallet"}
                    </Button>
                </div>

                {/* Create wallet form */}
                {showCreateWallet && (
                    <div className="border border-pink-200 p-4 rounded-lg mb-4 bg-pink-50">
                        <h3 className="font-semibold mb-3 text-gray-800">Create New Wallet</h3>
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 mb-1 block">Initial Balance</label>
                                <Input
                                    type="number"
                                    placeholder="Enter initial balance"
                                    value={newWalletBalance}
                                    onChange={(e) => setNewWalletBalance(e.target.value)}
                                    min="0"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 mb-1 block">Currency</label>
                                <Select value={newWalletCurrency} onValueChange={(value) => setNewWalletCurrency(value as "INR" | "USD")}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">INR</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button 
                                onClick={handleCreateWallet} 
                                disabled={creatingWallet || !newWalletBalance || parseFloat(newWalletBalance) <= 0}
                                className="cursor-pointer"
                            >
                                {creatingWallet ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </div>
                )}

                {loadingWallets ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border p-4 rounded-md animate-pulse">
                                <div className="mb-3">
                                    <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : wallets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wallets.map((wallet) => (
                            <div className="border border-gray-200 p-5 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow" key={wallet._id}>
                                <div className="mb-3">
                                    <p className="text-2xl font-bold text-gray-800">{wallet.currency}</p>
                                    <p className="text-sm text-gray-600 mt-1">Balance: <span className="font-semibold text-green-600">{wallet.balance.toFixed(2)}</span></p>
                                    <p className="text-sm text-gray-600">Locked: <span className="font-semibold text-orange-600">{wallet.lockedBalance.toFixed(2)}</span></p>
                                </div>
                                
                                {/* Add balance section */}
                                {addBalanceWalletId === wallet._id ? (
                                    <div className="space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Amount to add"
                                            value={addBalanceAmount}
                                            onChange={(e) => setAddBalanceAmount(e.target.value)}
                                            min="0"
                                        />
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={handleAddBalance}
                                                disabled={addingBalance || !addBalanceAmount || parseFloat(addBalanceAmount) <= 0}
                                                className="flex-1 cursor-pointer"
                                                size="sm"
                                            >
                                                {addingBalance ? "Adding..." : "Confirm"}
                                            </Button>
                                            <Button 
                                                onClick={() => {
                                                    setAddBalanceWalletId(null);
                                                    setAddBalanceAmount("");
                                                }}
                                                variant="outline"
                                                className="flex-1 cursor-pointer"
                                                size="sm"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button 
                                        onClick={() => setAddBalanceWalletId(wallet._id)}
                                        variant="outline"
                                        className="w-full cursor-pointer"
                                        size="sm"
                                    >
                                        Add Balance
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No wallets found. Create one to get started!</p>
                )}
            </div>}


            <main className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Markets</h2>
                    <div className="flex items-center gap-2">
                        {/* a button to create a new market only admin can see  */}
                        {user?.role === 'admin' && <Button onClick={() => router.push("/create-market")} className="cursor-pointer bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0">Create Market</Button>}
                        <Select value={status} onValueChange={(value) => setStatus(value as "open" | "closed" | "settled")}>
                            <SelectTrigger>
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

                <div className="flex flex-wrap gap-2 mt-4">
                    {loadingMarkets ? (
                        <>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="border p-4 rounded-md animate-pulse w-full md:w-[calc(50%-0.25rem)] lg:w-[calc(33.333%-0.33rem)]">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            ))}
                        </>
                    ) : markets.filter((market) => market.status.toLowerCase() === status.toLowerCase()).length > 0 ? (
                        markets.filter((market) => market.status.toLowerCase() === status.toLowerCase()).map((market) => {
                            const totalBets = market.totalBetAmount.yes + market.totalBetAmount.no;
                            const yesProb  = totalBets > 0 ? Math.round((market.totalBetAmount.yes / totalBets) * 100): 50;
                            const noProb = totalBets > 0 ? Math.round((market.totalBetAmount.no / totalBets) * 100) : 50;
                            return (
                                <div onClick={() => router.push(`/market/${market._id}`)} className="bg-white border border-gray-200 p-5 rounded-lg cursor-pointer hover:shadow-lg hover:border-pink-300 transition-all duration-200" key={market._id}>
                                    <h2 className="text-lg font-bold text-gray-800 mb-2">{market.title}</h2>
                                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Description:</span> {market.description}</p>
                                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Category:</span> {market.category}</p>
                                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">End Date:</span> {new Date(market.endDate).toLocaleDateString()}</p>
                                    {market.winningOutcome && <p className="text-sm text-green-600 font-semibold mt-2">Winning Outcome: {market.winningOutcome}</p>}
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm text-gray-600">Yes: ₹{market.totalBetAmount.yes} ({yesProb}%) </div> <div className="text-sm text-gray-600">No: ₹{market.totalBetAmount.no} ({noProb}%)</div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-sm text-gray-500 w-full text-center py-8">No markets found for this status.</p>
                    )}
                </div>
            </main>
        </div>
    )
}

export default Dashboard;