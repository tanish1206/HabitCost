import { RawTransaction, NormalizedExpense } from "./types";
import { classifyTransaction } from "./merchantClassifier";

export function normalizeTransaction(raw: RawTransaction): NormalizedExpense {
    const classification = classifyTransaction(raw.description);

    return {
        id: raw.id,
        amount: raw.amount,
        date: raw.date,
        appId: classification.appId || "other",
        category: classification.category || "Uncategorized",
        note: raw.description, // Keep original desc for reference
        source: raw.source,
        isFlagged: classification.confidence < 0.5 // Flag low confidence
    };
}

export function normalizeTransactions(rawList: RawTransaction[]): NormalizedExpense[] {
    return rawList
        .filter(t => t.type === "debit") // Only process expenses
        .map(normalizeTransaction);
}
