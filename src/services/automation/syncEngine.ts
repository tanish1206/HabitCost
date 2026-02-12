import { fetchBankTransactions } from "./bankAggregatorService";
import { fetchSmsTransactions } from "./smsParserService";
import { parseEmailReceipts } from "./emailReceiptParser";
import { normalizeTransactions } from "./transactionNormalizer";
import { SyncStats, NormalizedExpense, SyncHistoryItem } from "./types";

export interface SyncResult {
    stats: SyncStats;
    expenses: NormalizedExpense[];
}

// In-memory history for demo purposes (would be in DB/Store)
let syncHistory: SyncHistoryItem[] = [];

export function getSyncHistory(): SyncHistoryItem[] {
    return syncHistory;
}

export async function runFullSync(): Promise<SyncResult> {
    const timestamp = new Date().toISOString();

    try {
        // 1. Fetch from all sources in parallel
        const [bankTxns, smsTxns, emailTxns] = await Promise.all([
            fetchBankTransactions(),
            fetchSmsTransactions(),
            parseEmailReceipts()
        ]);

        // 2. Normalize all
        const normalizedBank = normalizeTransactions(bankTxns);
        const normalizedSms = normalizeTransactions(smsTxns);
        const normalizedEmail = normalizeTransactions(emailTxns);

        // 3. Combine
        const allExpenses = [
            ...normalizedBank,
            ...normalizedSms,
            ...normalizedEmail
        ];

        // 4. Deduplication Logic (Mock ID based)
        // We deduplicate within the current batch
        const uniqueExpensesMap = new Map<string, NormalizedExpense>();
        allExpenses.forEach(item => {
            if (!uniqueExpensesMap.has(item.id)) {
                uniqueExpensesMap.set(item.id, item);
            }
        });

        const uniqueExpenses = Array.from(uniqueExpensesMap.values());

        // 5. Generate Stats
        const stats: SyncStats = {
            newTransactionsCount: uniqueExpenses.length,
            totalProcessed: bankTxns.length + smsTxns.length + emailTxns.length,
            sources: {
                bank: normalizedBank.length,
                sms: normalizedSms.length,
                email: normalizedEmail.length
            },
            lastSyncedAt: timestamp
        };

        // 6. Update History
        syncHistory.unshift({
            id: `sync_${Date.now()}`,
            timestamp,
            stats,
            status: "success"
        });

        // Keep only last 10 entries
        if (syncHistory.length > 10) {
            syncHistory = syncHistory.slice(0, 10);
        }

        return {
            stats,
            expenses: uniqueExpenses
        };
    } catch (error) {
        console.error("Sync failed:", error);
        syncHistory.unshift({
            id: `sync_${Date.now()}`,
            timestamp,
            stats: {
                newTransactionsCount: 0,
                totalProcessed: 0,
                sources: { bank: 0, sms: 0, email: 0 },
                lastSyncedAt: timestamp
            },
            status: "failed"
        });
        throw error;
    }
}
