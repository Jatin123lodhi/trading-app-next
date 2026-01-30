export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto animate-pulse">
                {/* Back Button Skeleton */}
                <div className="mb-6">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                </div>
                
                {/* Market Header Card Skeleton */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {/* Title and Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="h-9 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                    </div>
                    
                    {/* Description Skeleton */}
                    <div className="mb-6 space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    
                    {/* Market Meta Information Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        {/* Category */}
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                        
                        {/* End Date */}
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trading Panel Skeleton */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Order Book Title */}
                    <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                    
                    {/* Yes/No Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                    
                    {/* Quantity Input */}
                    <div className="mb-4">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                    
                    {/* Price Display */}
                    <div className="mb-6">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                    
                    {/* Place Order Button */}
                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
