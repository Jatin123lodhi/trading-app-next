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
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 ${iconBgClass} rounded-xl shadow-sm`}>
            <Icon className={`w-6 h-6 ${iconColorClass}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold text-primary">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
