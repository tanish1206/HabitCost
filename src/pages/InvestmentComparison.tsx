import { useState, useMemo } from "react";
import { TrendingUp, BadgeDollarSign } from "lucide-react";
import { MOCK_EXPENSES, HABIT_APPS, getAppById, getAppMonthlyTotal, formatCurrency, calculateInvestmentGrowth } from "@/lib/data";
import { Slider } from "@/components/ui/slider";

const SCENARIOS = [
  { name: "Mutual Fund SIP", rate: 12, color: "hsl(15, 90%, 58%)" },
  { name: "Stock Market", rate: 14, color: "hsl(38, 92%, 55%)" },
  { name: "Savings Account", rate: 5, color: "hsl(165, 70%, 42%)" },
];

const YEARS = [1, 3, 5, 10];

export default function InvestmentComparison() {
  const [selectedYears, setSelectedYears] = useState(5);
  const [reductionPct, setReductionPct] = useState(30);

  const topApps = useMemo(() => {
    const map = new Map<string, number>();
    MOCK_EXPENSES
      .filter(e => e.date.startsWith("2026-02"))
      .forEach(e => map.set(e.appId, (map.get(e.appId) || 0) + e.amount));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([appId, monthly]) => ({ app: getAppById(appId)!, monthly }));
  }, []);

  const totalMonthlySavings = topApps.reduce((s, a) => s + a.monthly, 0) * (reductionPct / 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Investment View</h1>
        <p className="text-sm text-muted-foreground mt-1">What if you invested instead?</p>
      </header>

      {/* Reduction Slider */}
      <div className="px-5 mb-6">
        <div className="glass-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Reduce spending by</span>
            <span className="text-lg font-bold text-primary">{reductionPct}%</span>
          </div>
          <Slider
            value={[reductionPct]}
            onValueChange={([v]) => setReductionPct(v)}
            min={10}
            max={80}
            step={5}
          />
          <p className="text-xs text-muted-foreground">
            Monthly savings: {formatCurrency(Math.round(totalMonthlySavings))}
          </p>
        </div>
      </div>

      {/* Time Horizon */}
      <div className="px-5 mb-6">
        <div className="flex gap-2">
          {YEARS.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYears(y)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedYears === y
                  ? "gradient-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {y}Y
            </button>
          ))}
        </div>
      </div>

      {/* Investment Scenarios */}
      <div className="px-5 mb-6 space-y-3">
        <h2 className="text-sm font-semibold">If invested for {selectedYears} years</h2>
        {SCENARIOS.map(sc => {
          const projected = calculateInvestmentGrowth(totalMonthlySavings, sc.rate, selectedYears);
          const totalInvested = totalMonthlySavings * selectedYears * 12;
          const gains = projected - totalInvested;
          return (
            <div key={sc.name} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sc.color }} />
                <span className="text-sm font-medium">{sc.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{sc.rate}% p.a.</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: sc.color }}>
                {formatCurrency(Math.round(projected))}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>Invested: {formatCurrency(Math.round(totalInvested))}</span>
                <span className="text-accent">Gains: {formatCurrency(Math.round(gains))}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-App Breakdown */}
      <section className="px-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Per-App Opportunity Cost</h2>
        <div className="space-y-2">
          {topApps.map(({ app, monthly }) => {
            const savings = monthly * (reductionPct / 100);
            const projected = calculateInvestmentGrowth(savings, 12, selectedYears);
            const Icon = app.icon;
            return (
              <div key={app.id} className="glass-card flex items-center gap-3 p-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: app.color + "22", color: app.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{app.name}</p>
                  <p className="text-xs text-muted-foreground">Save {formatCurrency(Math.round(savings))}/mo</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">{formatCurrency(Math.round(projected))}</p>
                  <p className="text-[10px] text-muted-foreground">in {selectedYears}Y</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
