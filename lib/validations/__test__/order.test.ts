import { orderPlacementSchema } from "../order"

describe('orderPlacementSchema', () => {
    it('should validate a correct order', () => {
        const validOrder = {
            marketId: 'market123',
            amount: 200,
            outcome: 'Yes',
            walletId: 'wallet456'
        }

        const result = orderPlacementSchema.safeParse(validOrder);
        expect(result.success).toBe(true)
    })

    it('should fail for amount 0', () => {
        const orderWithZeroAmt = {
            marketId: 'market123',
            amount: 0,
            outcome: 'Yes',
            walletId: 'wallet456'
        }

        const result = orderPlacementSchema.safeParse(orderWithZeroAmt);
        expect(result.success).toBe(false)
    })

    it('should fail for negative amount', () => {
        const orderWithZeroAmt = {
            marketId: 'market123',
            amount: -10,
            outcome: 'Yes',
            walletId: 'wallet456'
        }

        const result = orderPlacementSchema.safeParse(orderWithZeroAmt);
        expect(result.success).toBe(false)
    })

    it('should fail for invalid outcome', () => {
        const orderWithZeroAmt = {
            marketId: 'market123',
            amount: 10,
            outcome: 'Maybe',
            walletId: 'wallet456'
        }

        const result = orderPlacementSchema.safeParse(orderWithZeroAmt);
        expect(result.success).toBe(false)
    })
})