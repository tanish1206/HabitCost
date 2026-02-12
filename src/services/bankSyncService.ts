import { parseTransactions } from "./transactionParser";
import { RawTransaction } from "./types";

const MOCK_BANK_TRANSACTIONS: RawTransaction[] = [
    { id: "tx_101", date: new Date().toISOString(), amount: 450, description: "UPI-SWIGGY-123456", type: "debit" },
    { id: "tx_102", date: new Date().toISOString(), amount: 280, description: "UBER RIDES INDIA", type: "debit" },
    { id: "tx_103", date: new Date().toISOString(), amount: 1500, description: "AMAZON RETAIL", type: "debit" },
    { id: "tx_104", date: new Date().toISOString(), amount: 89, description: "SPOTIFY PREMIUM", type: "debit" },
    { id: "tx_105", date: new Date().toISOString(), amount: 120, description: "Unknown Merchant", type: "debit" },
];

export async function fetchTransactions(): Promise<any[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return processed mock data using the parser
    return parseTransactions(MOCK_BANK_TRANSACTIONS);
}
