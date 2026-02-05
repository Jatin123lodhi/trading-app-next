"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { capitalizeCategory } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import type { Market } from "@/types";

interface TrendingMarketsProps {
  markets: Market[];
}

export default function TrendingMarkets({ markets }: TrendingMarketsProps) {
  const router = useRouter();

  if (markets.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Trending Markets</h2>
        </div>
        <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 w-fit">
          Top Volume
        </Badge>
      </div>
      <div className="relative overflow-hidden py-1">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps",
          }}
        >
          {/* Left gradient overlay */}
          {/* <div className="absolute left-0 top-0 bottom-0 w-10  bg-gradient-to-r from-card via-card/80 to-transparent z-10 pointer-events-none" /> */}
          
          {/* Right gradient overlay */}
          {/* <div className="absolute right-0 top-0 bottom-0 w-10  bg-gradient-to-l from-card via-card/80 to-transparent z-10 pointer-events-none" /> */}
          
          <CarouselContent className="px-6 sm:px-12">
            {markets.map((market) => {
              const totalBets = market.totalBetAmount.yes + market.totalBetAmount.no;
              const yesProb = totalBets > 0 ? Math.round((market.totalBetAmount.yes / totalBets) * 100) : 50;
              
              return (
                <CarouselItem key={market._id} className="pl-2 sm:pl-4 basis-full sm:basis-[85%] md:basis-[45%] lg:basis-[38%] py-1">
                  <Card 
                    onClick={() => router.push(`/market/${market._id}`)} 
                    className=" cursor-pointer hover:shadow-lg transition-all duration-300 border border-border bg-card hover:border-border h-48 sm:h-56 flex flex-col"
                  >
                    <CardContent className="px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs bg-muted text-primary border-0 px-2 py-1">
                            TRENDING
                          </Badge>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground font-medium">Volume</p>
                            <p className="text-sm font-bold text-primary">₹{totalBets.toLocaleString()}</p>
                          </div>
                        </div>
                        <h3 className="font-bold text-primary mb-2 line-clamp-1 text-xs sm:text-sm leading-tight">
                          {market.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {market.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3">
                        <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground px-2 py-1">
                          {capitalizeCategory(market.category)}
                        </Badge>
                        <div className="text-right flex items-center gap-1">
                          <p className="text-xs text-muted-foreground font-medium">YES</p>
                          <p className="text-xs font-bold text-emerald-600">({yesProb}%)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-0 z-20 cursor-pointer" />
          <CarouselNext className="right-0 z-20 cursor-pointer" />
        </Carousel>
      </div>
    </div>
  );
}
