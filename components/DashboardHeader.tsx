"use client";

import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
    userRole?: string;
}

export default function DashboardHeader({ userRole }: DashboardHeaderProps) {
    const router = useRouter();

    return (
        <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm border border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 sm:mb-3">
                        Trading Dashboard
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        Discover and trade on prediction markets
                    </p>
                </div>
                {userRole === "admin" && (
                    <Button
                        onClick={() => router.push("/create-market")}
                        className="cursor-pointer px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg shadow-sm w-full sm:w-auto"
                    >
                        <Target className="w-4 h-4 mr-2" />
                        Create Market
                    </Button>
                )}
            </div>
        </div>
    );
}
