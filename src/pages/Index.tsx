import { useMemo } from "react";
import { TrendingDown, TrendingUp, Wallet, Flame } from "lucide-react";
import {
  MOCK_EXPENSES, MOCK_GOALS, MOCK_CHALLENGES, HABIT_APPS,
  getAppById, getAppMonthlyTotal, getMonthlyTotal, formatCurrency,
} from "@/lib/data";
import AppSpendCard from "@/components/AppSpendCard";

export default function Dashboard() {
  const expenses = MOCK_EXPENSES;
  const totalThisMonth = useMemo(() => getMonthlyTotal(expenses, "2026-02"), [expenses]);
  const totalLastMonth = useMemo(() => getMonthlyTotal(expenses, "2026-01"), [expenses]);

  const topApps = useMemo(() => {
    const map = new Map<string, number>();
    expenses
      .filter(e => e.date.startsWith("2026-02"))
      .forEach(e => map.set(e.appId, (map.get(e.appId) || 0) + e.amount));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([appId, amount]) => ({ app: getAppById(appId)!, amount }));
  }, [expenses]);

  const recentExpenses = expenses.slice(0, 5);

  const activeGoals = MOCK_GOALS.length;
  const activeChallenges = MOCK_CHALLENGES.filter(c => c.status === "active").length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-5 pt-12 pb-6">
        <p className="text-sm text-muted-foreground">Good evening</p>
        <h1 className="text-2xl font-bold mt-1">Your Spending</h1>
      </header>

      {/* Total Spend Card */}
      <div className="px-5 mb-6">
        <div className="gradient-primary rounded-2xl p-5 text-primary-foreground">
          <p className="text-sm opacity-80">February 2026</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(totalThisMonth)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm opacity-80">
            {totalThisMonth > totalLastMonth ? (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>
                  {formatCurrency(totalThisMonth - totalLastMonth)} more than Jan
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4" />
                <span>
                  {formatCurrency(totalLastMonth - totalThisMonth)} less than Jan
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-5 mb-6 grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <Wallet className="h-5 w-5 mx-auto text-primary mb-1" />
          <p className="text-lg font-bold">{topApps.length}</p>
          <p className="text-[10px] text-muted-foreground">Apps Tracked</p>
        </div>
        <div className="glass-card p-3 text-center">
          <Flame className="h-5 w-5 mx-auto text-warning mb-1" />
          <p className="text-lg font-bold">{activeChallenges}</p>
          <p className="text-[10px] text-muted-foreground">Challenges</p>
        </div>
        <div className="glass-card p-3 text-center">
          <TrendingDown className="h-5 w-5 mx-auto text-accent mb-1" />
          <p className="text-lg font-bold">{activeGoals}</p>
          <p className="text-[10px] text-muted-foreground">Goals Active</p>
        </div>
      </div>

      {/* Top Spending Apps */}
      <section className="px-5 mb-6">
        <h2 className="text-base font-semibold mb-3">Top Spending Apps</h2>
        <div className="space-y-2">
          {topApps.map(({ app, amount }) => (
            <AppSpendCard key={app.id} app={app} amount={amount} />
          ))}
        </div>
      </section>

      {/* Recent Expenses */}
      <section className="px-5 mb-6">
        <h2 className="text-base font-semibold mb-3">Recent Expenses</h2>
        <div className="space-y-2">
          {recentExpenses.map(exp => {
            const app = getAppById(exp.appId);
            if (!app) return null;
            const Icon = app.icon;
            return (
              <div key={exp.id} className="glass-card flex items-center gap-3 p-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: app.color + "22", color: app.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{exp.note || exp.date}</p>
                </div>
                <p className="text-sm font-semibold">-{formatCurrency(exp.amount)}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
