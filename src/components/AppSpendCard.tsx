import { type HabitApp, formatCurrency } from "@/lib/data";

interface AppSpendCardProps {
  app: HabitApp;
  amount: number;
  trend?: number;
}

export default function AppSpendCard({ app, amount, trend }: AppSpendCardProps) {
  const Icon = app.icon;
  return (
    <div className="glass-card flex items-center gap-3 p-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: app.color + "22", color: app.color }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{app.name}</p>
        <p className="text-xs text-muted-foreground">{app.category}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
        {trend !== undefined && (
          <p className={`text-xs ${trend > 0 ? "text-destructive" : "text-accent"}`}>
            {trend > 0 ? "+" : ""}{trend}%
          </p>
        )}
      </div>
    </div>
  );
}
