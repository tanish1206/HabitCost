import { enhanceTransaction } from "./merchantClassifier";
import { RawTransaction, ParsedExpense } from "./types";

export function parseTransaction(rawTx: RawTransaction): ParsedExpense {
    const enhanced = enhanceTransaction(rawTx);

    return {
        id: rawTx.id,
        amount: rawTx.amount,
        date: rawTx.date,
        appId: enhanced.appId || "other",
        note: rawTx.description,
    };
}

export function parseTransactions(rawTxs: RawTransaction[]): ParsedExpense[] {
    return rawTxs
        .map(parseTransaction)
        .filter(t => t.appId !== "other");
}
