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
    marketId: string;
    walletId: string | { _id: string; currency: string };
    outcome: string;
    amount: string;
    status: string;
    createdAt: Date;
};

// API Response types
export type ApiResponse<T> = {
    message: string;
    data: T;
};
