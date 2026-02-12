import { useMemo } from "react";
import { Flame, Calendar, Zap } from "lucide-react";
import { MOCK_CHALLENGES, MOCK_EXPENSES, getAppById, formatCurrency } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

export default function Challenges() {
  const challenges = useMemo(() => {
    return MOCK_CHALLENGES.map(ch => {
      const app = getAppById(ch.appId);
      const start = new Date(ch.startDate);
      const now = new Date("2026-02-12");
      const daysPassed = Math.floor((now.getTime() - start.getTime()) / 86400000);
      const daysRemaining = Math.max(0, ch.duration - daysPassed);

      // Calculate spend during challenge period
      const spentDuring = MOCK_EXPENSES
        .filter(e => e.appId === ch.appId && e.date >= ch.startDate && e.date <= "2026-02-12")
        .reduce((s, e) => s + e.amount, 0);

      const totalLimit = ch.limitType === "daily"
        ? ch.spendLimit * daysPassed
        : ch.spendLimit * Math.ceil(daysPassed / 7);

      const progress = Math.min(100, Math.round((daysPassed / ch.duration) * 100));
      const streak = spentDuring <= totalLimit ? daysPassed : Math.max(0, daysPassed - 2);

      return { ...ch, app, daysPassed, daysRemaining, spentDuring, totalLimit, progress, streak };
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <p className="text-sm text-muted-foreground mt-1">Push your spending limits</p>
      </header>

      <div className="px-5 space-y-4">
        {challenges.map(ch => {
          if (!ch.app) return null;
          const Icon = ch.app.icon;
          const onTrack = ch.spentDuring <= ch.totalLimit;
          return (
            <div key={ch.id} className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: ch.app.color + "22", color: ch.app.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{ch.app.name} Challenge</p>
                  <p className="text-xs text-muted-foreground">
                    Max {formatCurrency(ch.spendLimit)}/{ch.limitType === "daily" ? "day" : "week"}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  ch.status === "active"
                    ? onTrack ? "bg-accent/15 text-accent" : "bg-warning/15 text-warning"
                    : ch.status === "completed" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                }`}>
                  {ch.status === "active" ? (onTrack ? "On Track" : "At Risk") : ch.status}
                </span>
              </div>

              <Progress value={ch.progress} className="h-2" />

              <div className="flex justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{ch.daysRemaining} days left</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-warning" />
                  <span>{ch.streak} day streak</span>
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Spent: {formatCurrency(ch.spentDuring)}</span>
                <span className={onTrack ? "text-accent" : "text-destructive"}>
                  Limit: {formatCurrency(ch.totalLimit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
