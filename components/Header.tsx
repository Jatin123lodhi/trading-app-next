"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import type { Wallet, User, CreateWalletData } from "@/types";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

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
            queryClient.invalidateQueries({ queryKey: ["portfolio-infinite"] });
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
            queryClient.invalidateQueries({ queryKey: ["portfolio-infinite"] });
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
        if (newWalletBalance.length > 7) {
            toast.error("Aadhar or PAN card required for such large amounts! 😄");
            return;
        }
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
        if (addBalanceAmount.length > 7) {
            toast.error("Aadhar or PAN card required for such large amounts! 😄");
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

    const handleThemeToggle = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        setMounted(true);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4">
                <div className="container mx-auto px-4 pt-2 pb-2 flex items-center justify-between">
                    <Link href="/" className="cursor-pointer text-xl font-bold">
                        TrueSplit
                    </Link>

                    <div className="flex items-center gap-6">
                        {/* Navigation Links */}
                        {user && (
                            <nav className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 rounded-md font-medium transition-colors cursor-pointer ${pathname === '/dashboard'
                                        ? 'text-primary bg-card'
                                        : 'text-muted-foreground hover:text-primary hover:bg-card'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                {user.role === "user" && (
                                    <Link
                                        href="/portfolio"
                                        className={`px-3 py-2 rounded-md font-medium transition-colors cursor-pointer ${pathname === '/portfolio'
                                            ? 'text-primary bg-card'
                                            : 'text-muted-foreground hover:text-primary hover:bg-card'
                                            }`}
                                    >
                                        Portfolio
                                    </Link>
                                )}
                                {user.role === "admin" && (
                                    <Link
                                        href="/create-market"
                                        className={`px-3 py-2 rounded-md font-medium transition-colors cursor-pointer ${pathname === '/create-market'
                                            ? 'text-primary bg-card'
                                            : 'text-muted-foreground hover:text-primary hover:bg-card'
                                            }`}
                                    >
                                        Create Market
                                    </Link>
                                )}
                            </nav>
                        )}

                        {/* Wallet Management Buttons for Users */}
                        {user?.role === "user" && (
                            <div className="flex items-center gap-2 pl-4 border-l border-border">
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
                                            setSelectedWallet(null);
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

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleThemeToggle}
                            className="h-8 w-8 text-muted-foreground hover:bg-card hover:text-primary cursor-pointer"
                            aria-label="Toggle dark mode"
                        >
                            {mounted && resolvedTheme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>

                        {/* User Profile Dropdown */}
                        {user && (
                            <div className="pl-4 border-l border-border">
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
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    Role: {user?.role}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>

                                        {/* Wallet Summary */}
                                        {user?.role === "user" && wallets.length > 0 && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <div className="px-2 py-2">
                                                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                                                        Wallets
                                                    </p>
                                                    {wallets.map((wallet) => (
                                                        <div
                                                            key={wallet._id}
                                                            className="flex justify-between items-center py-1"
                                                        >
                                                            <span className="text-xs text-muted-foreground">
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
                                            className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 dark:hover:bg-red-950 dark:focus:bg-red-950"
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
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
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={newWalletBalance}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow only numbers with up to 2 decimals (no length restriction here)
                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                        setNewWalletBalance(value);
                                    }
                                }}
                                onWheel={(e) => e.currentTarget.blur()}
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
                            Select a wallet and add funds to increase your balance.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Select Wallet</label>
                            <Select
                                value={selectedWallet?._id || ""}
                                onValueChange={(walletId) => {
                                    const wallet = wallets.find(w => w._id === walletId);
                                    setSelectedWallet(wallet || null);
                                }}
                            >
                                <SelectTrigger className="cursor-pointer w-full">
                                    <SelectValue placeholder="Select a wallet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map((wallet) => (
                                        <SelectItem key={wallet._id} value={wallet._id}>
                                            {wallet.currency} - Balance: {wallet.currency === 'USD' ? '$' : '₹'}{wallet.balance.toFixed(2)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedWallet && (
                            <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground">Current Balance</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {selectedWallet.currency === 'USD' ? '$' : '₹'}{selectedWallet.balance.toFixed(2)}
                                </p>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Amount to Add</label>
                            <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={addBalanceAmount}
                                disabled={!selectedWallet}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Allow only numbers with up to 2 decimals (no length restriction here)
                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                        setAddBalanceAmount(value);
                                    }
                                }}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleAddBalance}
                            disabled={addBalanceMutation.isPending || !selectedWallet || !addBalanceAmount}
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
