"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import MarketCard from "@/components/MarketCard";
import type { Market } from "@/types";

interface MarketsGridProps {
    loadingMarkets: boolean;
    filteredMarkets: Market[];
    searchQuery: string;
    selectedCategory: string;
    status: "open" | "closed" | "settled";
    averageVolume: number;
    onClearFilters: () => void;
}

export default function MarketsGrid({
    loadingMarkets,
    filteredMarkets,
    searchQuery,
    selectedCategory,
    status,
    averageVolume,
    onClearFilters,
}: MarketsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8">
            {loadingMarkets ? (
                <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse border border-border">
                            <CardContent className="p-5">
                                <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                                <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
                                <div className="h-4 bg-muted rounded w-full"></div>
                            </CardContent>
                        </Card>
                    ))}
                </>
            ) : filteredMarkets.length > 0 ? (
                filteredMarkets.map((market) => (
                    <MarketCard 
                        key={market._id}
                        market={market}
                        averageVolume={averageVolume}
                    />
                ))
            ) : (
                <div className="col-span-full">
                    <Card className="border border-border">
                        <CardContent className="p-8 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <Search className="w-12 h-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold text-primary">No markets found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery || selectedCategory !== "all" 
                                        ? "Try adjusting your search or filters" 
                                        : `No ${status} markets available at the moment`
                                    }
                                </p>
                                {(searchQuery || selectedCategory !== "all") && (
                                    <Button 
                                        variant="outline" 
                                        onClick={onClearFilters}
                                        className="mt-2"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
