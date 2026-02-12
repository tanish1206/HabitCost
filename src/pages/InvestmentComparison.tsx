import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Search, ArrowRight, ExternalLink } from "lucide-react";
import { getAppById, formatCurrency, calculateInvestmentGrowth } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MutualFund, searchMutualFunds } from "@/services/investment/mutualFundService";
import { useHabitStore } from "@/store/useHabitStore";

const SCENARIOS = [
  { name: "Mutual Fund SIP", rate: 12, color: "hsl(15, 90%, 58%)" },
  { name: "Stock Market", rate: 14, color: "hsl(38, 92%, 55%)" },
  { name: "Savings Account", rate: 5, color: "hsl(165, 70%, 42%)" },
];

const YEARS = [1, 3, 5, 10];

export default function InvestmentComparison() {
  const { expenses } = useHabitStore();
  const [selectedYears, setSelectedYears] = useState(5);
  const [reductionPct, setReductionPct] = useState(30);

  // Fund Explorer State
  const [searchQuery, setSearchQuery] = useState("");
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [loadingFunds, setLoadingFunds] = useState(false);

  // Fetch funds on search
  useEffect(() => {
    const fetchFunds = async () => {
      setLoadingFunds(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const results = searchMutualFunds(searchQuery);
      setFunds(results);
      setLoadingFunds(false);
    };

    const debounce = setTimeout(fetchFunds, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);


  // 1. Calculate Monthly Average Spend from Actual Data
  const monthlyAverage = useMemo(() => {
    if (expenses.length === 0) return 0;

    // Group by month
    const months = new Set(expenses.map(e => e.date.substring(0, 7))); // YYYY-MM
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Avoid division by zero, default to 1 month if less than a month of data
    const count = Math.max(months.size, 1);

    return total / count;
  }, [expenses]);

  // 2. Calculate Investable Amount (Opportunity Cost)
  const investableAmount = (monthlyAverage * reductionPct) / 100;

  // 3. Project Wealth for each scenario
  const projections = useMemo(() => {
    return SCENARIOS.map(scenario => ({
      ...scenario,
      value: calculateInvestmentGrowth(investableAmount, scenario.rate, selectedYears)
    }));
  }, [investableAmount, selectedYears]);

  const handleInvestClick = (fundName: string) => {
    toast.success(`Redirecting to partner to invest in ${fundName}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-5 pt-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Investment Potential</h1>
        <p className="text-sm text-muted-foreground">
          Turn your habit costs into wealth.
        </p>
      </header>

      {/* Control Card */}
      <div className="glass-card p-5 mb-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">If I reduced spending by</label>
            <span className="font-bold text-primary">{reductionPct}%</span>
          </div>
          <Slider
            value={[reductionPct]}
            onValueChange={(val) => setReductionPct(val[0])}
            max={50}
            step={5}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            That's <span className="text-foreground font-bold">{formatCurrency(investableAmount)}/mo</span> saved from your avg spend of {formatCurrency(monthlyAverage)}.
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Invested for</label>
            <span className="font-bold text-primary">{selectedYears} Years</span>
          </div>
          <div className="flex justify-between gap-2 mt-3">
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYears(y)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${selectedYears === y
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-accent"
                  }`}
              >
                {y}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Cards */}
      <div className="grid gap-4 mb-8">
        {projections.map(p => (
          <div key={p.name} className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
            <div
              className="absolute top-0 right-0 p-3 opacity-10"
              style={{ color: p.color }}
            >
              <TrendingUp className="h-12 w-12" />
            </div>

            <p className="text-sm text-muted-foreground mb-1">{p.name} ({p.rate}%)</p>
            <p className="text-2xl font-bold" style={{ color: p.color }}>
              {formatCurrency(p.value)}
            </p>
            <p className="text-xs opacity-70 mt-1">
              Projected value in {selectedYears} years
            </p>
          </div>
        ))}
      </div>

      {/* Mutual Fund Explorer */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Start Investing</h2>
          <span className="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded">Simulated</span>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Mutual Funds (e.g. HDFC, Axis)"
            className="pl-9 bg-card/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {loadingFunds ? (
            <div className="text-center py-4 text-sm text-muted-foreground">Searching...</div>
          ) : funds.length > 0 ? (
            funds.map(fund => (
              <div key={fund.id} className="glass-card p-3 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{fund.name}</p>
                    <div className="flex gap-2 text-[10px] mt-1">
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">{fund.category}</span>
                      <span className={`px-1.5 py-0.5 rounded ${fund.risk === 'High' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{fund.risk} Risk</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">3Y Returns</p>
                    <p className="text-sm font-bold text-green-500">+{fund.returns3Y}%</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 h-8 text-xs gap-1"
                  onClick={() => handleInvestClick(fund.name)}
                >
                  Invest via Partner <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-xl">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>Search for funds to verify returns</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
