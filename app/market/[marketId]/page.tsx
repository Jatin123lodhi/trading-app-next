import TradingPanel from "@/components/TradingPanel";

const fetchMarket = async (marketId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/market/${marketId}`);
    const data = await response.json();
    return data.data;
}


const MarketPage = async ({ params }: { params: Promise<{ marketId: string }> }) => {
    const { marketId } = await params;
    const market = await fetchMarket(marketId);

    return (
        <div className="p-4">
            <div className="">
                <h2 className="text-lg font-bold">{market.title}</h2>
                <p className="text-sm text-gray-500">Description: {market.description}</p>
                <p className="text-sm text-gray-500">Category: {market.category}</p>
                <p className="text-sm text-gray-500">End Date: {new Date(market.endDate).toLocaleDateString()}</p>
                {market.winningOutcome && <p className="text-sm text-gray-500"> Winning Outcome: {market.winningOutcome}</p>}
            </div>
            {market.status === 'open' ? <div className="mt-4">
                <TradingPanel market={market} />
            </div> : market.status === 'closed' ? <div className="mt-4">
                <p className="text-sm text-gray-500">Market is closed</p>
            </div> : <div className="mt-4">
                <p className="text-sm text-gray-500">Market is settled</p>
            </div>}

           

        </div>
    );
};

export default MarketPage;