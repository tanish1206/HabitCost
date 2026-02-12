// TODO: Replace bankAggregatorService with Plaid integration
// TODO: Add webhook support for real-time updates
import { RawTransaction } from "./types";

const MOCK_BANK_DATA = [
    { description: "SWIGGY INSTAMART", amount: 450 },
    { description: "ZOMATO ONLINE ORDER", amount: 320 },
    { description: "UBER TRIP", amount: 180 },
    { description: "AMAZON PAY INDIA", amount: 1499 },
    { description: "NETFLIX.COM", amount: 649 },
    { description: "STARBUCKS IND", amount: 350 },
    { description: "SPOTIFY PREMIUM", amount: 119 },
];

export async function fetchBankTransactions(): Promise<RawTransaction[]> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate 2-5 random transactions
    const count = Math.floor(Math.random() * 4) + 2;
    const transactions: RawTransaction[] = [];

    for (let i = 0; i < count; i++) {
        const template = MOCK_BANK_DATA[Math.floor(Math.random() * MOCK_BANK_DATA.length)];
        // Add some variance to amount
        const variance = Math.floor(Math.random() * 50) - 25;

        transactions.push({
            id: `bank_${Date.now()}_${i}`,
            description: template.description,
            amount: template.amount + variance,
            date: new Date().toISOString(),
            type: "debit",
            accountId: "acc_hdfc_123",
            source: "bank"
        });
    }

    return transactions;
}
