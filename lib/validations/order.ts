import { z } from "zod"

export const orderPlacementSchema = z.object({
    marketId: z.string().min(1, 'MarketId is required'),
    amount: z.number().positive('Amount must be positive'),
    outcome: z.union([z.literal('Yes'), z.literal('No')]),
    walletId: z.string().min(1, 'WalletId is required')
})