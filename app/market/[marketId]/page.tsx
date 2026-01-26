import TradingPanel from "@/components/TradingPanel";
import BackButton from "@/components/BackButton";
import { Calendar, Tag, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";

const fetchMarket = async (marketId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
        const response = await fetch(`${baseUrl}/api/markets/${marketId}`, {
            cache: 'no-store' // Ensure fresh data
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Market not found');
            }
            throw new Error(`Failed to fetch market: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.data) {
            throw new Error('Invalid market data received');
        }
        
        return data.data;
    } catch (error: unknown) {
        console.error('Error fetching market:', error);
        throw error; // Re-throw to let Next.js handle it
    }
}


const MarketPage = async ({ params }: { params: Promise<{ marketId: string }> }) => {
    const { marketId } = await params;
    const market = await fetchMarket(marketId);

    if (!market) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Market Not Found</h2>
                    <p className="text-gray-600">The market you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    // Get status badge styling
    const getStatusBadge = () => {
        switch (market.status) {
            case 'open':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border">
                        <TrendingUp className="w-4 h-4" />
                        Open
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4" />
                        Closed
                    </span>
                );
            case 'settled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <CheckCircle2 className="w-4 h-4" />
                        Settled
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <BackButton />
                
                {/* Market Header Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 flex-1">{market.title}</h1>
                        {getStatusBadge()}
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">{market.description}</p>
                    
                    {/* Market Meta Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Tag className="w-5 h-5 " />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                                <p className="text-sm font-medium">{market.category}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-5 h-5 " />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                                <p className="text-sm font-medium">
                                    {new Date(market.endDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        
                        {market.winningOutcome && (
                            <div className="flex items-center gap-3 text-gray-600 md:col-span-2">
                                {market.winningOutcome === 'Yes' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Winning Outcome</p>
                                    <p className="text-sm font-medium">{market.winningOutcome}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trading Panel or Status Message */}
                {market.status === 'open' ? (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <TradingPanel market={market} />
                    </div>
                ) : market.status === 'closed' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Market is Closed</h3>
                        <p className="text-yellow-700">This market is no longer accepting new orders. Waiting for settlement.</p>
                    </div>
                ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Market is Settled</h3>
                        <p className="text-blue-700">This market has been settled with outcome: <strong>{market.winningOutcome}</strong></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketPage;