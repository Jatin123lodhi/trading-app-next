import jwt from "jsonwebtoken"
import { verifyAuth } from "../auth"

jest.mock('jsonwebtoken')

describe('verifyAuth function test', () => {
    
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret'

        // clear all mocks to start fresh
        jest.clearAllMocks()
    })

    it('valid token without role requirement', async () => {

        (jwt.verify as jest.Mock).mockReturnValue({
            userId: '123',
            email: 'test@example.com',
            role: 'user'
        })

        // create a simpler mock request 
        const request =  {
            headers: {
                get: (key: string) => {
                    if(key === 'authorization') return 'Bearer valid-token'
                    return null
                }
            }
        } as Request

        const result = await verifyAuth(request);

        // test result should have userId
        expect(result).toHaveProperty('userId', '123')
        expect(result).not.toHaveProperty('error')
    })

    it('should verify valid token with correct role', async () => {
        (jwt.verify as jest.Mock).mockReturnValue({
            userId: '456',
            email: 'admin@example.com',
            role: 'admin'
        })

        const request = {
            headers: {
                get: (key: string) => {
                    if(key === 'authorization') return 'Bearer valid-admin-token'
                    return null
                }
            }
        } as Request

        const result = await verifyAuth(request, 'admin');

        expect(result).toHaveProperty('userId', '456')
        expect(result).toHaveProperty('role', 'admin')
        expect(result).not.toHaveProperty('error')
    })
})