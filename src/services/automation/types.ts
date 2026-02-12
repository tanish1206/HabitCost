export interface RawTransaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: "debit" | "credit";
    accountId: string;
    source: "bank" | "sms" | "email";
}

export interface ClassificationResult {
    appId: string | null;
    category: string | null;
    confidence: number;
}

export interface NormalizedExpense {
    id: string;
    amount: number;
    date: string;
    appId: string; // 'other' if uncategorized
    category: string;
    note: string;
    source: "bank" | "sms" | "email";
    isFlagged?: boolean; // If high spend
}


export interface SyncStats {
    newTransactionsCount: number;
    totalProcessed: number;
    sources: {
        bank: number;
        sms: number;
        email: number;
    };
    lastSyncedAt: string;
}

export interface SyncHistoryItem {
    id: string;
    timestamp: string;
    stats: SyncStats;
    status: "success" | "failed";
}
