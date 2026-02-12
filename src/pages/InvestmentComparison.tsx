import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Search, Check, ExternalLink } from "lucide-react";
import { MOCK_EXPENSES, getAppById, formatCurrency, calculateInvestmentGrowth } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchFunds, type MutualFund } from "@/services/mutualFundService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const YEARS = [1, 3, 5, 10];

export default function InvestmentComparison() {
  const [selectedYears, setSelectedYears] = useState(5);
  const [reductionPct, setReductionPct] = useState(30);

  // Mutual Fund Explorer State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MutualFund[]>([]);
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        setIsSearching(true);
        const results = await searchFunds(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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

  // Dynamic Scenarios based on selection
  const scenarios = [
    {
      name: selectedFund ? selectedFund.name : "Mutual Fund SIP",
      rate: selectedFund ? selectedFund.returns["5Y"] : 12,
      color: "hsl(15, 90%, 58%)",
      isCustom: !!selectedFund
    },
    { name: "Stock Market", rate: 14, color: "hsl(38, 92%, 55%)" },
    { name: "Savings Account", rate: 5, color: "hsl(165, 70%, 42%)" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Investment View</h1>
        <p className="text-sm text-muted-foreground mt-1">Make your money work for you</p>
      </header>

      {/* Fund Explorer */}
      <div className="px-5 mb-6">
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold mb-3">Explore Real Funds</h2>
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={selectedFund ? selectedFund.name : "Search mutual funds..."}
                  className="pl-9 pointer-events-none"
                  readOnly
                />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Mutual Fund</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search funds..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {isSearching ? (
                    <p className="text-center text-sm text-muted-foreground">Searching...</p>
                  ) : searchResults.map(fund => (
                    <div
                      key={fund.id}
                      onClick={() => {
                        setSelectedFund(fund);
                        toast.success(`Selected ${fund.name}`);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors ${selectedFund?.id === fund.id ? "border-primary bg-primary/10" : "border-border"
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{fund.name}</p>
                          <p className="text-xs text-muted-foreground">{fund.category} • {fund.risk}</p>
                        </div>
                        {selectedFund?.id === fund.id && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="mt-2 flex gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">1Y: </span>
                          <span className="text-green-500 font-medium">{fund.returns["1Y"]}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">3Y: </span>
                          <span className="text-green-500 font-medium">{fund.returns["3Y"]}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">5Y: </span>
                          <span className="text-green-500 font-medium">{fund.returns["5Y"]}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isSearching && searchQuery && searchResults.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">No funds found</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
        <h2 className="text-sm font-semibold">If invested for {selectedYears} years</h2>
        {scenarios.map(sc => {
          const projected = calculateInvestmentGrowth(totalMonthlySavings, sc.rate, selectedYears);
          const totalInvested = totalMonthlySavings * selectedYears * 12;
          const gains = projected - totalInvested;
          return (
            <div key={sc.name} className={`glass-card p-4 ${sc.isCustom ? "border-primary/50 relative overflow-hidden" : ""}`}>
              {sc.isCustom && <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary text-[10px] text-primary-foreground rounded-bl-lg">Selected</div>}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sc.color }} />
                <span className="text-sm font-medium truncate max-w-[200px]">{sc.name}</span>
                <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">{sc.rate}% p.a.</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: sc.color }}>
                {formatCurrency(Math.round(projected))}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>Invested: {formatCurrency(Math.round(totalInvested))}</span>
                <span className="text-accent">Gains: {formatCurrency(Math.round(gains))}</span>
              </div>

              {sc.isCustom && (
                <Button className="w-full mt-3 h-8 text-xs" variant="outline">
                  Invest Now <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              )}
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
            // Use selected fund rate if available, else default 12%
            const rate = selectedFund ? selectedFund.returns["5Y"] : 12;
            const projected = calculateInvestmentGrowth(savings, rate, selectedYears);
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
                  <p className="text-[10px] text-muted-foreground">w/ {rate}% return</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
