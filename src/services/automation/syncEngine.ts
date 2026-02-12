import { fetchBankTransactions } from "./bankAggregatorService";
import { fetchSmsTransactions } from "./smsParserService";
import { parseEmailReceipts } from "./emailReceiptParser";
import { normalizeTransactions } from "./transactionNormalizer";
import { SyncStats, NormalizedExpense } from "./types";

export interface SyncResult {
    stats: SyncStats;
    expenses: NormalizedExpense[];
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

        // 3. Combine All (No filtering yet)
        const allExpenses = [
            ...normalizedBank,
            ...normalizedSms,
            ...normalizedEmail
        ];

        // 4. Generate Stats (Raw counts from sources)
        const stats: SyncStats = {
            newTransactionsCount: allExpenses.length, // Total found, not necessarily new to store
            totalProcessed: bankTxns.length + smsTxns.length + emailTxns.length,
            sources: {
                bank: normalizedBank.length,
                sms: normalizedSms.length,
                email: normalizedEmail.length
            },
            lastSyncedAt: timestamp
        };

        return {
            stats,
            expenses: allExpenses
        };
    } catch (error) {
        console.error("Sync failed:", error);
        throw error;
    }
}
