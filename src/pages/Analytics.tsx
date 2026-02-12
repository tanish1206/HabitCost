import { useMemo } from "react";
import { MOCK_EXPENSES, HABIT_APPS, getAppById, formatCurrency } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const COLORS = [
  "hsl(15, 90%, 58%)", "hsl(165, 70%, 42%)", "hsl(38, 92%, 55%)",
  "hsl(260, 60%, 60%)", "hsl(200, 70%, 55%)", "hsl(330, 70%, 55%)",
  "hsl(140, 65%, 45%)", "hsl(0, 75%, 50%)",
];

export default function Analytics() {
  const expenses = MOCK_EXPENSES;

  const appTotals = useMemo(() => {
    const map = new Map<string, number>();
    expenses
      .filter(e => e.date.startsWith("2026-02"))
      .forEach(e => map.set(e.appId, (map.get(e.appId) || 0) + e.amount));
    return Array.from(map.entries())
      .map(([appId, total]) => ({ name: getAppById(appId)?.name || appId, total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    expenses
      .filter(e => e.date.startsWith("2026-02"))
      .forEach(e => {
        const cat = getAppById(e.appId)?.category || "Other";
        map.set(cat, (map.get(cat) || 0) + e.amount);
      });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const dailyTrend = useMemo(() => {
    const map = new Map<string, number>();
    expenses
      .filter(e => e.date.startsWith("2026-02"))
      .forEach(e => map.set(e.date, (map.get(e.date) || 0) + e.amount));
    return Array.from(map.entries())
      .map(([date, total]) => ({ date: date.slice(8), total }))
      .sort((a, b) => Number(a.date) - Number(b.date));
  }, [expenses]);

  const totalSpend = appTotals.reduce((s, a) => s + a.total, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">February 2026 insights</p>
      </header>

      {/* App Spending Bar Chart */}
      <section className="px-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Spending by App</h2>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appTotals} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(210, 20%, 92%)", fontSize: 11 }} width={55} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                {appTotals.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Category Pie Chart */}
      <section className="px-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">By Category</h2>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryTotals}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryTotals.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-3">
            {categoryTotals.map((cat, i) => (
              <span key={cat.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {cat.name} ({Math.round((cat.value / totalSpend) * 100)}%)
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Trend */}
      <section className="px-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Daily Spending Trend</h2>
        <div className="glass-card p-4">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Line type="monotone" dataKey="total" stroke="hsl(15, 90%, 58%)" strokeWidth={2} dot={{ fill: "hsl(15, 90%, 58%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
