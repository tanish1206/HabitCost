import { useState, useMemo, useEffect } from "react";
import { TrendingDown, TrendingUp, Wallet, Flame, RefreshCw, Plus, Trophy, Zap, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import {
  MOCK_EXPENSES, MOCK_GOALS, MOCK_CHALLENGES,
  getAppById, getMonthlyTotal, formatCurrency, HABIT_APPS, getAppMonthlyTotal
} from "@/lib/data";
import TrackedAppsManager from "@/components/TrackedAppsManager";
import BossCard from "@/components/BossCard";
import { useHabitStore } from "@/store/useHabitStore";

export default function Dashboard() {
  const {
    expenses,
    syncHistory,
    lastSynced,
    isSyncing,
    runSync,
    userXP,
    userLevel,
    streaks,
    selectedApps,
    checkAchievements
  } = useHabitStore();

  const [showAppManager, setShowAppManager] = useState(false);

  // Auto-sync
  useEffect(() => {
    if (!lastSynced) {
      runSync();
    }
    // Check achievements on mount too
    checkAchievements();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => selectedApps.includes(e.appId));
  }, [expenses, selectedApps]);

  const currentMonth = "2026-02"; // Mock current month
  const lastMonth = "2026-01"; // Mock last month

  const totalThisMonth = useMemo(() => getMonthlyTotal(filteredExpenses, currentMonth), [filteredExpenses]);

  // XP Progress to next level (Mod 100)
  const xpProgress = userXP % 100;

  // Boss Data: Sort by highest spend this month
  const bossData = useMemo(() => {
    return selectedApps
      .map(appId => {
        const app = getAppById(appId);
        if (!app) return null;
        return {
          app,
          currentSpend: getAppMonthlyTotal(filteredExpenses, appId, currentMonth),
          lastSpend: getAppMonthlyTotal(filteredExpenses, appId, lastMonth)
        };
      })
      .filter(b => b !== null)
      .sort((a, b) => b!.currentSpend - a!.currentSpend);
  }, [selectedApps, filteredExpenses]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* --- GAMIFIED HUD --- */}
      <header className="px-5 pt-8 pb-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-2xl border-4 border-background shadow-xl">
                {userLevel}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background text-black shadow-sm">
                LVL
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Habit Slayer</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${xpProgress}%` }} />
                </div>
                <span className="text-[10px] font-mono font-medium opacity-60">{userXP} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAppManager(true)}
            className="p-2 bg-secondary/50 rounded-full hover:bg-secondary transition-colors"
            title="Manage Bosses"
          >
            <Plus className="h-5 w-5 opacity-70" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-2 py-3 flex flex-col items-center justify-center gap-1 bg-card/60">
            <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
            <span className="font-bold text-lg">{streaks.dailySync}</span>
            <span className="text-[9px] uppercase tracking-wider opacity-60">Day Streak</span>
          </div>
          <button
            onClick={runSync}
            disabled={isSyncing}
            className="glass-card p-2 py-3 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform bg-primary/10 hover:bg-primary/20 border-primary/20"
          >
            <RefreshCw className={`h-5 w-5 text-primary ${isSyncing ? "animate-spin" : ""}`} />
            <span className="font-bold text-lg text-primary">{isSyncing ? "..." : "Fight"}</span>
            <span className="text-[9px] uppercase tracking-wider opacity-60 text-primary">Sync</span>
          </button>
          <div className="glass-card p-2 py-3 flex flex-col items-center justify-center gap-1 bg-card/60">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-lg">{formatCurrency(totalThisMonth)}</span>
            <span className="text-[9px] uppercase tracking-wider opacity-60">Damage Taken</span>
          </div>
        </div>
      </header>

      <TrackedAppsManager
        open={showAppManager}
        onOpenChange={setShowAppManager}
      />

      {/* --- BATTLEGROUND (Boss Grid) --- */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Habit Bosses
          </h2>
        </div>

        <div className="space-y-3">
          {bossData.map((data) => (
            data && <BossCard
              key={data.app.id}
              app={data.app}
              currentMonthSpend={data.currentSpend}
              lastMonthSpend={data.lastSpend || 1000} // Default boss HP
            />
          ))}

          {bossData.length === 0 && (
            <div className="text-center py-10 opacity-50 border-2 border-dashed border-border rounded-xl">
              <p>No Bosses Selected</p>
              <p className="text-xs mt-1">Tap + to add habits to fight</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
