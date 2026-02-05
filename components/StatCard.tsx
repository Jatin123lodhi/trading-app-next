import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBgClass?: string;
  iconColorClass?: string;
  hoverEffect?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  iconBgClass = "bg-muted",
  iconColorClass = "text-primary",
  hoverEffect = true,
}: StatCardProps) {
  return (
    <Card
      className={`shadow-sm bg-card border border-border ${
        hoverEffect ? "transition-all duration-300 hover:scale-105 hover:shadow-lg" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`p-2 sm:p-3 ${iconBgClass} rounded-xl shadow-sm flex-shrink-0`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{label}</p>
            <p className="text-xl sm:text-2xl font-bold text-primary truncate">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
