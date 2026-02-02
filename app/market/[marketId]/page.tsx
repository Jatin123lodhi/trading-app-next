import TradingPanel from "@/components/TradingPanel";
import BackButton from "@/components/BackButton";
import { capitalizeCategory } from "@/lib/utils";
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-2">Market Not Found</h2>
                    <p className="text-muted-foreground">The market you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    // Get status badge styling
    const getStatusBadge = () => {
        switch (market.status) {
            case 'open':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border border-border bg-primary text-primary-foreground">
                        <TrendingUp className="w-4 h-4" />
                        Open
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border border-border">
                        <Clock className="w-4 h-4" />
                        Closed
                    </span>
                );
            case 'settled':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground border border-border">
                        <CheckCircle2 className="w-4 h-4" />
                        Settled
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pt-20">
            <div className="max-w-4xl mx-auto">
                <BackButton />
                
                {/* Market Header Card */}
                <div className="bg-card rounded-lg shadow-md p-6 mb-6 border border-border">
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-3xl font-bold text-primary flex-1">{market.title}</h1>
                        {getStatusBadge()}
                    </div>
                    
                    <p className="text-foreground text-lg mb-6 leading-relaxed">{market.description}</p>
                    
                    {/* Market Meta Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Tag className="w-5 h-5" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Category</p>
                                <p className="text-sm font-medium text-foreground">{capitalizeCategory(market.category)}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="w-5 h-5" />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">End Date</p>
                                <p className="text-sm font-medium text-foreground">
                                    {new Date(market.endDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        
                        {market.winningOutcome && (
                            <div className="flex items-center gap-3 text-muted-foreground md:col-span-2">
                                {market.winningOutcome === 'Yes' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Winning Outcome</p>
                                    <p className="text-sm font-medium text-foreground">{market.winningOutcome}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trading Panel or Status Message */}
                {market.status === 'open' ? (
                    <div className="bg-card rounded-lg shadow-md p-6 border border-border">
                        <TradingPanel market={market} />
                    </div>
                ) : market.status === 'closed' ? (
                    <div className="bg-muted border border-border rounded-lg p-6 text-center">
                        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-primary mb-2">Market is Closed</h3>
                        <p className="text-muted-foreground">This market is no longer accepting new orders. Waiting for settlement.</p>
                    </div>
                ) : (
                    <div className="bg-muted border border-border rounded-lg p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-primary mb-2">Market is Settled</h3>
                        <p className="text-muted-foreground">This market has been settled with outcome: <strong className="text-foreground">{market.winningOutcome}</strong></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketPage;