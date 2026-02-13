import { HabitApp, formatCurrency } from "@/lib/data";
import { useHabitStore } from "@/store/useHabitStore";
import { Loader2, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useMemo } from "react";

interface BossCardProps {
    app: HabitApp;
    currentMonthSpend: number;
    lastMonthSpend: number;
}

export default function BossCard({ app, currentMonthSpend, lastMonthSpend }: BossCardProps) {
    const Icon = app.icon;

    // Boss Health Logic:
    // Max Health = Last Month Spend (The "Boss" strength) or a baseline if 0.
    // Damage Taken = Current Month Spend.
    // If you spend MORE than last month, the boss is "Growing stronger".
    // If you spend LESS, the boss is "Taking damage".

    // Visualization:
    // Health Bar is INVERSE. Low spend = High Player Health?
    // Let's frame it as "Boss Power Level".
    // 0% Power = ₹0 spent (Best).
    // 100% Power = Last Month's Spend.
    // Over 100% = Boss Enraged (Critical Warning).

    const bossMaxHealth = Math.max(lastMonthSpend, 1000); // Minimum boss strength of 1000
    const bossCurrentPower = currentMonthSpend;
    const powerPct = Math.min((bossCurrentPower / bossMaxHealth) * 100, 100);
    const isEnraged = bossCurrentPower > bossMaxHealth;

    // Color logic
    // Low power (Good) = Green/Blue
    // Mid power (Warning) = Yellow/Orange
    // High power (Danger) = Red
    // Enraged = Pulsing Purple/Red

    const powerColor = isEnraged
        ? "bg-gradient-to-r from-red-600 to-purple-600 animate-pulse"
        : powerPct > 75
            ? "bg-red-500"
            : powerPct > 40
                ? "bg-yellow-500"
                : "bg-green-500";

    const diff = currentMonthSpend - lastMonthSpend;

    return (
        <div className={`
            relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:bg-accent/5
            ${isEnraged ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : ""}
        `}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: app.color + "20", color: app.color }}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base">{app.name}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                            {app.category} BOSS
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-mono font-bold text-lg">{formatCurrency(currentMonthSpend)}</p>
                    <p className={`text-[10px] flex items-center justify-end gap-1 ${diff > 0 ? "text-red-400" : "text-green-400"}`}>
                        {diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(diff) < 1 ? "0" : formatCurrency(Math.abs(diff))}
                    </p>
                </div>
            </div>

            {/* Boss Power Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-medium opacity-70">
                    <span>Boss Power</span>
                    <span>{Math.round(powerPct)}%</span>
                </div>
                <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${powerColor}`}
                        style={{ width: `${isEnraged ? 100 : powerPct}%` }}
                    />
                </div>
                {isEnraged && (
                    <p className="text-[10px] text-red-400 font-bold animate-pulse text-center mt-1">
                        ⚠️ BOSS OVERPOWERED! CUT SPENDING!
                    </p>
                )}
            </div>
        </div>
    );
}
