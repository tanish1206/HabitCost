// TODO: Replace bankAggregatorService with Plaid integration
// TODO: Add webhook support for real-time updates
import { RawTransaction } from "./types";

const BANK_DESCRIPTIONS = [
    "SWIGGY INSTAMART",
    "ZOMATO MEDIA",
    "UBER INDIA",
    "AMAZON PAY",
    "NETFLIX.COM",
    "HDFC CREDIT CARD PAYMENT",
    "STARBUCKS COFFEE",
    "SPOTIFY AB",
    "BLINKIT GROCERY",
    "AIRTEL PAYMENT"
];

export async function fetchBankTransactions(): Promise<RawTransaction[]> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate 2-5 random transactions
    const count = Math.floor(Math.random() * 4) + 2;
    const transactions: RawTransaction[] = [];

    for (let i = 0; i < count; i++) {
        const description = BANK_DESCRIPTIONS[Math.floor(Math.random() * BANK_DESCRIPTIONS.length)];
        // Random amount between 50 and 2000
        const amount = Math.floor(Math.random() * 1950) + 50;

        // Date within last 60 days
        const pastDays = Math.floor(Math.random() * 60);
        const date = new Date();
        date.setDate(date.getDate() - pastDays);

        transactions.push({
            id: `bank_${Date.now()}_${i}`,
            description,
            amount,
            date: date.toISOString(),
            type: "debit", // Only debits for now
            accountId: "acc_hdfc_123",
            source: "bank"
        });
    }

    return transactions;
}
