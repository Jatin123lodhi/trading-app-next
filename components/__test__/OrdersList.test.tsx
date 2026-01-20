import { render, waitFor, screen } from "@testing-library/react"
import OrdersList from "../OrdersList"

// mock fetch globally
global.fetch = jest.fn()

// mock local storage
const mockLocalStorage = {
    getItem: jest.fn()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.localStorage = mockLocalStorage as any

describe('OrderList component test', () => {

    beforeEach(() => {
        jest.clearAllMocks()

        mockLocalStorage.getItem.mockReturnValue('fake-token-123')
    })

    it('should render orders for a marketId ', async () => {

        (global.fetch as jest.Mock).mockReturnValue({
            json: async () => ({
                data: [
                    {
                        _id: 'order1',
                        amount: 100,
                        outcome: 'Yes',
                        status: 'locked',
                        createdAt: new Date('2024-01-15')
                    }
                ]
            })
        })

        render(<OrdersList marketId="market123" />)

        await waitFor(() => {
            // check heading
            expect(screen.getByText('Orders')).toBeInTheDocument()

            // check first order details
            expect(screen.getByText('Amount: 100')).toBeInTheDocument()
            expect(screen.getByText('Placed Outcome: Yes')).toBeInTheDocument()
            expect(screen.getByText('Status: locked')).toBeInTheDocument()
        })
    })
})