// User types
export type User = {
    email: string;
    role: string;
    userId: string;
};

// Wallet types
export type Wallet = {
    _id: string;
    balance: number;
    currency: string;
    lockedBalance: number;
};

export type CreateWalletData = {
    currency: string;
    balance: number;
};

// Market types
export type Market = {
    _id: string;
    title: string;
    description: string;
    category: string;
    endDate: Date;
    winningOutcome: string;
    status: 'open' | 'closed' | 'settled';
    totalBetAmount: {
        yes: number;
        no: number;
    };
};

// Order types
export type Order = {
    _id: string;
    userId: string;
    marketId: string | { _id: string; title: string; status: string };
    walletId: string | { _id: string; currency: string };
    outcome: string;
    amount: number;
    status: string;
    createdAt: string;
};

// Portfolio types
export type PortfolioOverview = {
    totalPortfolioValue: number;
    totalBalance: number;
    totalLockedBalance: number;
    totalPnL: number;
    winRate: number;
    totalOrders: number;
    wonOrders: number;
    lostOrders: number;
    pendingOrders: number;
};

export type PortfolioData = {
    overview: PortfolioOverview;
    orders: Order[];
    wallets: Wallet[];
};

// API Response types
export type ApiResponse<T> = {
    message: string;
    data: T;
};
