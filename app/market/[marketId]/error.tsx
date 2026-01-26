'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Market page error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {error.message === 'Market not found' ? 'Market Not Found' : 'Something went wrong!'}
                    </h2>
                    <p className="text-gray-600">
                        {error.message === 'Market not found' 
                            ? 'The market you&apos;re looking for doesn&apos;t exist or has been removed.' 
                            : error.message || 'Failed to load market data. Please try again.'}
                    </p>
                </div>
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="cursor-pointer"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/dashboard'}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}
