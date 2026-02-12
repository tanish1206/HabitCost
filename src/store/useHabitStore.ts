import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NormalizedExpense, SyncHistoryItem } from '@/services/automation/types';
import { Goal, Challenge, HABIT_APPS, MOCK_EXPENSES, MOCK_GOALS, MOCK_CHALLENGES } from '@/lib/data';
import { runFullSync } from '@/services/automation/syncEngine';
import { toast } from "sonner";

interface HabitState {
    // State
    selectedApps: string[];
    expenses: NormalizedExpense[];
    goals: Goal[];
    challenges: Challenge[];
    syncHistory: SyncHistoryItem[];
    lastSynced: string | null;
    isSyncing: boolean;

    // Actions
    toggleApp: (appId: string) => void;
    setExpenses: (expenses: NormalizedExpense[]) => void;
    runSync: () => Promise<void>;
    resetStore: () => void;
}

export const useHabitStore = create<HabitState>()(
    persist(
        (set, get) => ({
            // Initial State
            selectedApps: HABIT_APPS.map(a => a.id), // Default all tracked
            expenses: MOCK_EXPENSES.map(e => ({
                ...e,
                appId: e.appId,
                category: "Uncategorized", // Fallback for mock compatibility
                source: "bank" as const
            })) as unknown as NormalizedExpense[], // Casting for mock compatibility
            goals: MOCK_GOALS,
            challenges: MOCK_CHALLENGES,
            syncHistory: [],
            lastSynced: null,
            isSyncing: false,

            // Actions
            toggleApp: (appId) => set((state) => {
                const isSelected = state.selectedApps.includes(appId);
                const newSelected = isSelected
                    ? state.selectedApps.filter(id => id !== appId)
                    : [...state.selectedApps, appId];
                return { selectedApps: newSelected };
            }),

            setExpenses: (expenses) => set({ expenses }),

            runSync: async () => {
                set({ isSyncing: true });
                try {
                    // 1. Fetch raw data (Pure function call)
                    const result = await runFullSync();

                    const state = get();

                    // 2. Filter by currently selected apps
                    // The engine returns everything; we filter here to respect user choice
                    const relevantExpenses = result.expenses.filter(e =>
                        state.selectedApps.includes(e.appId)
                    );

                    // 3. Deduplicate (Simple ID check against existing)
                    const existingIds = new Set(state.expenses.map(e => e.id));
                    const newExpenses = relevantExpenses.filter(e => !existingIds.has(e.id));

                    // 4. Merge
                    const updatedExpenses = [...newExpenses, ...state.expenses];

                    // 5. Update Goals based on new expenses (Simple re-eval)
                    // For now, we just update expenses. Goals active status logic should be in a selector or computed.

                    set({
                        expenses: updatedExpenses,
                        lastSynced: result.stats.lastSyncedAt,
                        syncHistory: [
                            {
                                id: `sync_${Date.now()}`,
                                timestamp: result.stats.lastSyncedAt,
                                stats: {
                                    ...result.stats,
                                    newTransactionsCount: newExpenses.length
                                },
                                status: "success" as const
                            },
                            ...state.syncHistory
                        ].slice(0, 50)
                    });

                    if (newExpenses.length > 0) {
                        toast.success(`Synced ${newExpenses.length} new transactions`);
                    } else {
                        toast.info("No new transactions found");
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
                    lastSynced: null
                });
            },
        }),
        {
            name: 'habit-storage', // unique name
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedApps: state.selectedApps,
                expenses: state.expenses,
                goals: state.goals,
                challenges: state.challenges,
                syncHistory: state.syncHistory,
                lastSynced: state.lastSynced
            }),
        }
    )
);
