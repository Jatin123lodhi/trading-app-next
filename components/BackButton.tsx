'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackButton() {
    const router = useRouter()

    return (
        <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 hover:bg-gray-100 cursor-pointer"
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>
    )
}
