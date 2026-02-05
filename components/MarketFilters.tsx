"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { capitalizeCategory } from "@/lib/utils";

interface MarketFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    status: "open" | "closed" | "settled";
    setStatus: (status: "open" | "closed" | "settled") => void;
    categories: string[];
}

export default function MarketFilters({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    status,
    setStatus,
    categories,
}: MarketFiltersProps) {
    return (
        <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-border">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-primary">All Markets</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder="Search by title, description, or category"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-3 border-border focus:border-border focus:ring-2 focus:ring-ring rounded-lg shadow-sm"
                        />
                    </div>
                    
                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-48 border-border py-3 rounded-lg shadow-sm">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category.toLowerCase()}>
                                    {capitalizeCategory(category)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    {/* Status Filter */}
                    <Select value={status} onValueChange={(value) => setStatus(value as "open" | "closed" | "settled")}>
                        <SelectTrigger className="w-full sm:w-32 md:w-36 border-border py-3 rounded-lg shadow-sm">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="settled">Settled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all") && (
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                    {searchQuery && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border px-3 py-2">
                            Search: &quot;{searchQuery}&quot;
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="ml-2 text-muted-foreground hover:text-primary font-bold cursor-pointer"
                            >
                                ×
                            </button>
                        </Badge>
                    )}
                    {selectedCategory !== "all" && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border border-border px-3 py-1 flex items-center gap-2">
                            <span>Category: {capitalizeCategory(categories.find(c => c.toLowerCase() === selectedCategory) || selectedCategory)}</span>
                            <button 
                                onClick={() => setSelectedCategory("all")}
                                className="text-lg text-muted-foreground hover:text-primary font-bold cursor-pointer"
                            >
                                ×
                            </button> 
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
