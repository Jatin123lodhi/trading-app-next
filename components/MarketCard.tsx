"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { capitalizeCategory } from "@/lib/utils";
import type { Market } from "@/types";

interface MarketCardProps {
    market: Market;
    averageVolume: number;
}

const MarketCard = ({ market, averageVolume }: MarketCardProps) => {
    const router = useRouter();
    const totalBets = market.totalBetAmount.yes + market.totalBetAmount.no;
    const yesProb = totalBets > 0 ? Math.round((market.totalBetAmount.yes / totalBets) * 100) : 50;
    const noProb = totalBets > 0 ? Math.round((market.totalBetAmount.no / totalBets) * 100) : 50;
    const isLive = market.status === 'open';
    const isHot = totalBets > averageVolume;

    return (
        <Card 
            key={market._id}
            onClick={() => router.push(`/market/${market._id}`)} 
            className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-card hover:scale-[1.02] group"
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                        <Badge 
                            variant={isLive ? "default" : "secondary"} 
                            className={`text-xs ${isLive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                        >
                            {market.status.toUpperCase()}
                        </Badge>
                        {isHot && (
                            <Badge variant="outline" className="text-xs bg-muted text-primary border-border">
                                HOT
                            </Badge>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(market.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <CardTitle className="text-lg font-bold text-primary line-clamp-2 group-hover:text-primary transition-colors">
                    {market.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {market.description}
                </p>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {capitalizeCategory(market.category)}
                    </Badge>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Volume</p>
                        <p className="text-sm font-bold text-primary">₹{totalBets.toLocaleString()}</p>
                    </div>
                </div>
                
                {market.winningOutcome && (
                    <div className="mb-4 p-2 bg-muted rounded-lg border border-border">
                        <p className="text-sm text-primary font-semibold">
                            Winner: {market.winningOutcome}
                        </p>
                    </div>
                )}
                
                {/* Betting Stats - Horizontal Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-primary">YES</span>
                        <span className="text-primary">NO</span>
                    </div>
                    <div className="relative h-5 bg-muted rounded-full overflow-hidden border border-border">
                        {/* YES portion */}
                        <div 
                            className="absolute left-0 top-0 h-full bg-primary/80 transition-all duration-300 flex items-center justify-end pr-2"
                            style={{ width: `${yesProb}%` }}
                        >
                            {yesProb >= 8 && (
                                <span className={`text-xs font-bold text-primary-foreground ${isLive ? 'animate-pulse' : ''}`}>
                                    {yesProb}%
                                </span>
                            )}
                        </div>
                        {/* NO portion */}
                        <div 
                            className="absolute right-0 top-0 h-full bg-muted-foreground/40 transition-all duration-300 flex items-center justify-start pl-2"
                            style={{ width: `${noProb}%` }}
                        >
                            {noProb >= 8 && (
                                <span className={`text-xs font-bold text-foreground ${isLive ? 'animate-pulse' : ''}`}>
                                    {noProb}%
                                </span>
                            )}
                        </div>
                        {/* Center percentage labels for small segments */}
                        {yesProb < 8 && noProb < 8 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-xs font-semibold">
                                    <span className="text-primary-foreground">{yesProb}%</span>
                                    <span className="text-foreground">/</span>
                                    <span className="text-foreground">{noProb}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>₹{market.totalBetAmount.yes.toLocaleString()}</span>
                        <span>₹{market.totalBetAmount.no.toLocaleString()}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MarketCard;
