import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Search, ArrowRight, ExternalLink } from "lucide-react";
import { MOCK_EXPENSES, getAppById, formatCurrency, calculateInvestmentGrowth } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MutualFund, searchMutualFunds } from "@/services/investment/mutualFundService";

const SCENARIOS = [
  { name: "Mutual Fund SIP", rate: 12, color: "hsl(15, 90%, 58%)" },
  { name: "Stock Market", rate: 14, color: "hsl(38, 92%, 55%)" },
  { name: "Savings Account", rate: 5, color: "hsl(165, 70%, 42%)" },
];

const YEARS = [1, 3, 5, 10];

export default function InvestmentComparison() {
  const [selectedYears, setSelectedYears] = useState(5);
  const [reductionPct, setReductionPct] = useState(30);
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);

  // Fund Explorer State
  const [searchQuery, setSearchQuery] = useState("");
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [loadingFunds, setLoadingFunds] = useState(false);

  // Load expenses from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("habitCost_expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Fetch funds on search
  useEffect(() => {
    const fetchFunds = async () => {
      setLoadingFunds(true);
      try {
        const results = await searchMutualFunds(searchQuery);
        setFunds(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFunds(false);
      }
    };
    const debounce = setTimeout(fetchFunds, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const topApps = useMemo(() => {
    const map = new Map<string, number>();
    // Filter for current month (mocked as Feb 2026 for now, or dynamic)
    const currentMonthPrefix = new Date().toISOString().slice(0, 7); // e.g., "2026-02"

    // Fallback to "2026-02" if no data for current month (for demo purposes)
    const targetMonth = expenses.some(e => e.date.startsWith(currentMonthPrefix)) ? currentMonthPrefix : "2026-02";

    expenses
      .filter(e => e.date.startsWith(targetMonth))
      .forEach(e => map.set(e.appId, (map.get(e.appId) || 0) + e.amount));

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([appId, monthly]) => ({ app: getAppById(appId)!, monthly }));
  }, [expenses]);

  const totalMonthlySpend = topApps.reduce((s, a) => s + a.monthly, 0);
  const totalMonthlySavings = totalMonthlySpend * (reductionPct / 100);

  const handleInvestClick = (fundName: string) => {
    toast.success(`Redirecting to partner to invest in ${fundName}...`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Investment View</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Turn your <span className="text-accent font-semibold">{formatCurrency(totalMonthlySpend)}</span> monthly spend into wealth.
        </p>
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
            Monthly investable amount: <span className="font-bold text-foreground">{formatCurrency(Math.round(totalMonthlySavings))}</span>
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
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedYears === y
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
        <h2 className="text-sm font-semibold">Projected Wealth</h2>
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
              <div className="flex justify-between items-end">
                <p className="text-2xl font-bold" style={{ color: sc.color }}>
                  {formatCurrency(Math.round(projected))}
                </p>
                <p className="text-xs text-accent mb-1">
                  +{formatCurrency(Math.round(gains))} gains
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mutual Fund Explorer */}
      <section className="px-5 mb-6">
        <h2 className="text-base font-semibold mb-3">Mutual Fund Explorer</h2>
        <div className="glass-card p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search funds (e.g. Nippon, HDFC)"
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {loadingFunds ? (
              <p className="text-center text-xs text-muted-foreground py-4">Loading funds...</p>
            ) : funds.length > 0 ? (
              funds.map(fund => (
                <div key={fund.id} className="p-3 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-medium line-clamp-1">{fund.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{fund.category}</span>
                        <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">{fund.risk} Risk</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-accent font-bold">+{fund.returns["3Y"]}%</p>
                      <p className="text-[10px] text-muted-foreground">3Y Returns</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full text-xs h-8 gap-1"
                    variant="outline"
                    onClick={() => handleInvestClick(fund.name)}
                  >
                    Invest via Partner <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-muted-foreground py-4">No funds found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Per-App Breakdown */}
      <section className="px-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Your Top Spenders</h2>
        <div className="space-y-2">
          {topApps.map(({ app, monthly }) => {
            const savings = monthly * (reductionPct / 100);
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
                  <p className="text-xs text-muted-foreground">Spend: {formatCurrency(Math.round(monthly))}/mo</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{formatCurrency(Math.round(savings))}</p>
                  <p className="text-[10px] text-muted-foreground">Potential Savings</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
