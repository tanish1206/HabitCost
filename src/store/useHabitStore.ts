import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NormalizedExpense, SyncHistoryItem } from '@/services/automation/types';
import { Goal, Challenge, HABIT_APPS, MOCK_EXPENSES, MOCK_GOALS, MOCK_CHALLENGES } from '@/lib/data';
import { runFullSync } from '@/services/automation/syncEngine';
import { toast } from "sonner";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
}

interface HabitState {
    // Core State
    selectedApps: string[];
    expenses: NormalizedExpense[];
    goals: Goal[];
    challenges: Challenge[];
    syncHistory: SyncHistoryItem[];
    lastSynced: string | null;
    isSyncing: boolean;

    // Gamification State
    userXP: number;
    userLevel: number;
    streaks: {
        dailySync: number;
        lastSyncDate: string | null;
        bestStreak: number;
    };
    achievements: Achievement[];

    // Actions
    toggleApp: (appId: string) => void;
    setExpenses: (expenses: NormalizedExpense[]) => void;
    runSync: () => Promise<void>;
    resetStore: () => void;
    checkAchievements: () => void; // Helper to run post-sync
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_sync', title: 'First Steps', description: 'Synced your first transaction', icon: '🚀' },
    { id: '7_day_streak', title: 'Discipline Master', description: '7 Day Sync Streak', icon: '🔥' },
    { id: 'level_5', title: 'Habit Warrior', description: 'Reached Level 5', icon: '⚔️' },
    { id: 'saver', title: 'Wealth Builder', description: 'Saved ₹1000 in investment potential', icon: '💰' },
];

export const useHabitStore = create<HabitState>()(
    persist(
        (set, get) => ({
            // Initial State
            selectedApps: HABIT_APPS.map(a => a.id),
            expenses: MOCK_EXPENSES.map(e => ({
                ...e,
                appId: e.appId,
                category: "Uncategorized",
                source: "bank" as const
            })) as unknown as NormalizedExpense[],
            goals: MOCK_GOALS,
            challenges: MOCK_CHALLENGES,
            syncHistory: [],
            lastSynced: null,
            isSyncing: false,

            // Gamification Initial State
            userXP: 0,
            userLevel: 1,
            streaks: { dailySync: 0, lastSyncDate: null, bestStreak: 0 },
            achievements: INITIAL_ACHIEVEMENTS,


            // Actions
            toggleApp: (appId) => set((state) => {
                const isSelected = state.selectedApps.includes(appId);
                const newSelected = isSelected
                    ? state.selectedApps.filter(id => id !== appId)
                    : [...state.selectedApps, appId];
                return { selectedApps: newSelected };
            }),

            setExpenses: (expenses) => set({ expenses }),

            checkAchievements: () => {
                const state = get();
                const unlocked = [...state.achievements];
                let newUnlock = false;

                // Check 1: First Sync
                if (state.expenses.length > 0 && !unlocked.find(a => a.id === 'first_sync')?.unlockedAt) {
                    const idx = unlocked.findIndex(a => a.id === 'first_sync');
                    if (idx !== -1) {
                        unlocked[idx] = { ...unlocked[idx], unlockedAt: new Date().toISOString() };
                        toast.success(`Achievement Unlocked: ${unlocked[idx].title} ${unlocked[idx].icon}`);
                        newUnlock = true;
                    }
                }

                // Check 2: Level 5
                if (state.userLevel >= 5 && !unlocked.find(a => a.id === 'level_5')?.unlockedAt) {
                    const idx = unlocked.findIndex(a => a.id === 'level_5');
                    if (idx !== -1) {
                        unlocked[idx] = { ...unlocked[idx], unlockedAt: new Date().toISOString() };
                        toast.success(`Achievement Unlocked: ${unlocked[idx].title} ${unlocked[idx].icon}`);
                        newUnlock = true;
                    }
                }

                if (newUnlock) set({ achievements: unlocked });
            },

            runSync: async () => {
                set({ isSyncing: true });
                try {
                    const result = await runFullSync();
                    const state = get();

                    // Filter & Dedupe
                    const relevantExpenses = result.expenses.filter(e => state.selectedApps.includes(e.appId));
                    const existingIds = new Set(state.expenses.map(e => e.id));
                    const newExpenses = relevantExpenses.filter(e => !existingIds.has(e.id));
                    const updatedExpenses = [...newExpenses, ...state.expenses];

                    // --- GAMIFICATION LOGIC ---
                    let xpGained = 0;

                    // 1. XP for Syncing (Daily Streak Logic)
                    const today = new Date().toISOString().slice(0, 10);
                    const lastSyncDate = state.streaks.lastSyncDate ? state.streaks.lastSyncDate.slice(0, 10) : null;

                    let newStreak = state.streaks.dailySync;

                    if (lastSyncDate !== today) {
                        if (lastSyncDate && new Date(today).getTime() - new Date(lastSyncDate).getTime() <= 86400000) {
                            // Consecutive day
                            newStreak += 1;
                            xpGained += 50 + (newStreak * 10); // Streak bonus
                            toast.info(`🔥 Streak: ${newStreak} Days! (+${50 + (newStreak * 10)} XP)`);
                        } else if (lastSyncDate && new Date(today).getTime() - new Date(lastSyncDate).getTime() > 86400000) {
                            // Broken streak (unless first time)
                            newStreak = 1;
                            xpGained += 50;
                            if (state.streaks.lastSyncDate) toast.info("Streak Broken! Starting over.");
                        } else {
                            // First ever sync
                            newStreak = 1;
                            xpGained += 50;
                        }
                    }

                    // 2. XP for Keeping Bosses "Healthy" (Low Spending)
                    // If no *new* expenses for a Boss in last 3 days? (Simplified for now: +10 XP per sync if < avg spend)
                    // Let's just give XP for syncing new data for now to encourage activity.
                    xpGained += (newExpenses.length * 5); // +5 XP per new transaction tracked

                    // Update XP & Level
                    const newXP = state.userXP + xpGained;
                    const newLevel = Math.floor(newXP / 100) + 1;

                    if (newLevel > state.userLevel) {
                        toast.success(`🎉 LEVEL UP! You are now Level ${newLevel}!`);
                    }

                    set({
                        expenses: updatedExpenses,
                        lastSynced: result.stats.lastSyncedAt,
                        userXP: newXP,
                        userLevel: newLevel,
                        streaks: {
                            dailySync: newStreak,
                            lastSyncDate: result.stats.lastSyncedAt,
                            bestStreak: Math.max(newStreak, state.streaks.bestStreak)
                        },
                        syncHistory: [
                            {
                                id: `sync_${Date.now()}`,
                                timestamp: result.stats.lastSyncedAt,
                                stats: { ...result.stats, newTransactionsCount: newExpenses.length },
                                status: "success" as const
                            },
                            ...state.syncHistory
                        ].slice(0, 50)
                    });

                    // Trigger achievement check
                    state.checkAchievements();

                    if (newExpenses.length > 0) {
                        toast.success(`Synced ${newExpenses.length} txns. +${xpGained} XP!`);
                    } else if (xpGained > 0) {
                        // Only Streak XP
                        toast.success(`Daily Sync Complete. +${xpGained} XP!`);
                    } else {
                        toast.info("Already synced recently.");
                    }

                } catch (error) {
                    console.error("Sync failed:", error);
                    toast.error("Sync failed");
                } finally {
                    set({ isSyncing: false });
                }
            },

            resetStore: () => {
                localStorage.removeItem('habit-storage');
                set({
                    selectedApps: HABIT_APPS.map(a => a.id),
                    expenses: [],
                    goals: MOCK_GOALS,
                    challenges: MOCK_CHALLENGES,
                    syncHistory: [],
                    lastSynced: null,
                    userXP: 0,
                    userLevel: 1,
                    streaks: { dailySync: 0, lastSyncDate: null, bestStreak: 0 },
                    achievements: INITIAL_ACHIEVEMENTS
                });
            },
        }),
        {
            name: 'habit-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedApps: state.selectedApps,
                expenses: state.expenses,
                goals: state.goals,
                challenges: state.challenges,
                syncHistory: state.syncHistory,
                lastSynced: state.lastSynced,
                userXP: state.userXP,
                userLevel: state.userLevel,
                streaks: state.streaks,
                achievements: state.achievements
            }),
        }
    )
);
