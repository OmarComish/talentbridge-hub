import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
}: KPICardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
      ? "text-red-500"
      : "text-muted-foreground";

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full shrink-0 ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{title}</p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
        <p className={`text-xs font-medium mt-0.5 ${changeColor}`}>{change}</p>
      </div>
    </div>
  );
}
