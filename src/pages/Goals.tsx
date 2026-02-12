import { useMemo } from "react";
import { Target, TrendingDown } from "lucide-react";
import {
  MOCK_EXPENSES, MOCK_GOALS, getAppById, getAppMonthlyTotal, formatCurrency,
} from "@/lib/data";
import { Progress } from "@/components/ui/progress";

export default function Goals() {
  const expenses = MOCK_EXPENSES;

  const goals = useMemo(() => {
    return MOCK_GOALS.map(goal => {
      const app = getAppById(goal.appId);
      const currentSpend = getAppMonthlyTotal(expenses, goal.appId, "2026-02");
      const prevSpend = getAppMonthlyTotal(expenses, goal.appId, "2026-01");
      const progress = Math.min(100, Math.round((1 - currentSpend / (prevSpend || goal.targetMonthly * 1.5)) * 100));
      const remaining = Math.max(0, goal.targetMonthly - currentSpend);
      return { ...goal, app, currentSpend, prevSpend, progress: Math.max(0, progress), remaining };
    });
  }, [expenses]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Savings Goals</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your spending targets</p>
      </header>

      <div className="px-5 space-y-4">
        {goals.map(goal => {
          if (!goal.app) return null;
          const Icon = goal.app.icon;
          const overBudget = goal.currentSpend > goal.targetMonthly;
          return (
            <div key={goal.id} className="glass-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: goal.app.color + "22", color: goal.app.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{goal.app.name}</p>
                  <p className="text-xs text-muted-foreground">Target: {formatCurrency(goal.targetMonthly)}/mo</p>
                </div>
                {overBudget ? (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-destructive/15 text-destructive">
                    Over budget
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/15 text-accent">
                    On track
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spent: {formatCurrency(goal.currentSpend)}</span>
                  <span>{formatCurrency(goal.remaining)} left</span>
                </div>
                <Progress
                  value={Math.min(100, (goal.currentSpend / goal.targetMonthly) * 100)}
                  className="h-2"
                />
              </div>

              {!overBudget && goal.remaining > 0 && (
                <div className="flex items-center gap-2 text-xs text-accent">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Save {formatCurrency(goal.remaining)} more this month</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
