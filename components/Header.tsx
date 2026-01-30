"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import type { Wallet, User, CreateWalletData } from "@/types";

export default function Header() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Dialog states
    const [createWalletDialogOpen, setCreateWalletDialogOpen] = useState(false);
    const [addBalanceDialogOpen, setAddBalanceDialogOpen] = useState(false);

    // Wallet creation states
    const [newWalletCurrency, setNewWalletCurrency] = useState<"INR" | "USD">("INR");
    const [newWalletBalance, setNewWalletBalance] = useState("");

    // Add balance states
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [addBalanceAmount, setAddBalanceAmount] = useState("");

    const { data: user } = useQuery<User>({
        queryKey: ["user"],
        queryFn: () => apiClient<User>("/api/auth/me"),
        retry: false,
    });

    const { data: wallets = [] } = useQuery<Wallet[]>({
        queryKey: ["wallets"],
        queryFn: () => apiClient<Wallet[]>("/api/wallets"),
        enabled: !!user && user.role === "user",
    });

    // handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            toast.success("Logged out successfully");
            localStorage.removeItem("token");
            // Clear all queries from cache
            queryClient.clear();
            // Redirect to login page
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
            localStorage.removeItem("token");
            // Clear all queries from cache even on error
            queryClient.clear();
            router.push("/login");
            router.refresh();
        }
    };

    const createWalletMutation = useMutation({
        mutationFn: (newWallet: CreateWalletData) =>
            apiClient("/api/wallets", {
                method: "POST",
                data: newWallet,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] });
            toast.success("Wallet created successfully!");
            setCreateWalletDialogOpen(false);
            setNewWalletBalance("");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create wallet");
        },
    });

    const addBalanceMutation = useMutation({
        mutationFn: ({
            walletId,
            amount,
        }: {
            walletId: string;
            amount: number;
        }) =>
            apiClient(`/api/wallets/${walletId}/transactions`, {
                method: "POST",
                data: {
                    type: "deposit",
                    amount,
                    description: "Balance added",
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] });
            toast.success("Balance added successfully!");
            setAddBalanceDialogOpen(false);
            setAddBalanceAmount("");
            setSelectedWallet(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add balance");
        },
    });

    const handleCreateWallet = () => {
        const balance = parseFloat(newWalletBalance);
        if (isNaN(balance) || balance < 0) {
            toast.error("Please enter a valid balance");
            return;
        }
        createWalletMutation.mutate({
            currency: newWalletCurrency,
            balance,
        });
    };

    const handleAddBalance = () => {
        if (!selectedWallet) {
            toast.error("No wallet selected");
            return;
        }
        const amount = parseFloat(addBalanceAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        addBalanceMutation.mutate({
            walletId: selectedWallet._id,
            amount,
        });
    };

    return (
        <>
            <header className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
                <Link href="/dashboard" className="cursor-pointer">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                        PredictX
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
                    {/* Wallet Management Buttons for Users */}
                    {user?.role === "user" && (
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setCreateWalletDialogOpen(true)}
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                            >
                                Create Wallet
                            </Button>
                            {wallets.length > 0 && (
                                <Button
                                    onClick={() => {
                                        setSelectedWallet(wallets[0]);
                                        setAddBalanceDialogOpen(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                >
                                    Add Balance
                                </Button>
                            )}
                        </div>
                    )}

                    {/* User Profile Dropdown */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full cursor-pointer border"
                                >
                                    {user?.email?.[0]?.toUpperCase()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-48" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.email}
                                        </p>
                                        <p className="text-xs leading-none text-gray-500">
                                            Role: {user?.role}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>

                                {/* Wallet Summary */}
                                {user?.role === "user" && wallets.length > 0 && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <div className="px-2 py-2">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">
                                                Wallets
                                            </p>
                                            {wallets.map((wallet) => (
                                                <div
                                                    key={wallet._id}
                                                    className="flex justify-between items-center py-1"
                                                >
                                                    <span className="text-xs text-gray-600">
                                                        {wallet.currency}
                                                    </span>
                                                    <span className="text-xs font-semibold">
                                                        {wallet.balance.toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </header>

            {/* Create Wallet Dialog */}
            <Dialog
                open={createWalletDialogOpen}
                onOpenChange={setCreateWalletDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Wallet</DialogTitle>
                        <DialogDescription>
                            Add a new wallet to manage your funds. Choose your currency
                            and initial balance.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Currency</label>
                            <Select
                                value={newWalletCurrency}
                                onValueChange={(value: "INR" | "USD") =>
                                    setNewWalletCurrency(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR (₹)</SelectItem>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">
                                Initial Balance
                            </label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={newWalletBalance}
                                onChange={(e) => setNewWalletBalance(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleCreateWallet}
                            disabled={createWalletMutation.isPending}
                            className="cursor-pointer"
                        >
                            {createWalletMutation.isPending
                                ? "Creating..."
                                : "Create Wallet"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Balance Dialog */}
            <Dialog open={addBalanceDialogOpen} onOpenChange={setAddBalanceDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Balance</DialogTitle>
                        <DialogDescription>
                            Add funds to your{" "}
                            {selectedWallet?.currency || "selected"} wallet.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {selectedWallet && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Current Balance</p>
                                <p className="text-2xl font-bold">
                                    {selectedWallet.currency}{" "}
                                    {selectedWallet.balance.toFixed(2)}
                                </p>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Amount to Add</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={addBalanceAmount}
                                onChange={(e) => setAddBalanceAmount(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleAddBalance}
                            disabled={addBalanceMutation.isPending}
                            className="cursor-pointer"
                        >
                            {addBalanceMutation.isPending
                                ? "Adding..."
                                : "Add Balance"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
