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
    // In a real app we would check against existing DB records
    const uniqueExpenses = Array.from(
        new Map(allExpenses.map(item => [item.id, item])).values()
    );

    // 5. Generate Stats
    const stats: SyncStats = {
        newTransactionsCount: uniqueExpenses.length,
        totalProcessed: bankTxns.length + smsTxns.length + emailTxns.length,
        sources: {
            bank: normalizedBank.length,
            sms: normalizedSms.length,
            email: normalizedEmail.length
        },
        lastSyncedAt: new Date().toISOString()
    };

    // TODO: Trigger alerts if thresholds crossed (AlertService)

    return {
        stats,
        expenses: uniqueExpenses
    };
}
