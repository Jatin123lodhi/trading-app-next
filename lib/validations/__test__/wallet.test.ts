import { createWalletSchema } from "../wallet"

describe('walletSchemaValidation', () => {
    it('valid wallet with INR currency', () => {
        const mockData = {
            balance: 10,
            currency: 'INR'
        }

        const result = createWalletSchema.safeParse(mockData);
        expect(result.success).toBe(true)
    })

    it('Invalid balance (zero)', () => {
        const mockData = {
            balance: 0,
            currency: 'INR'
        }

        const result = createWalletSchema.safeParse(mockData);
        expect(result.success).toBe(false)
    })    

    it('Invalid currency (EUR)', () => {
        const mockData = {
            balance: 0,
            currency: 'EUR'
        }

        const result = createWalletSchema.safeParse(mockData);
        expect(result.success).toBe(false)
    })   

})