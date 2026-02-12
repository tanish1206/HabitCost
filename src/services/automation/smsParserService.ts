// TODO: Replace SMS parser with Android SMS permission module
import { RawTransaction } from "./types";

const MOCK_SMS = [
    "Rs 349 spent on ZOMATO via HDFC Bank Credit Card XX1234 on 12-02-26.",
    "Debit: Rs 1500 for SWIGGY INSTAMART. Avl Bal: Rs 15000.",
    "Txn of Rs 180 at UBER INDIA done using UPI.",
    "Alert: Rs 999 debited for MYNTRA DESIGNS from your SBI Acct.",
];

export async function fetchSmsTransactions(): Promise<RawTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const transactions: RawTransaction[] = [];
    const numSms = Math.floor(Math.random() * 3) + 1; // 1 to 3 SMS

    for (let i = 0; i < numSms; i++) {
        const sms = MOCK_SMS[Math.floor(Math.random() * MOCK_SMS.length)];
        // Simple regex to extract "Rs XXX"
        const amountRegex = /(?:Rs|INR)\.?\s*(\d+)/i;
        const match = sms.match(amountRegex);

        if (match) {
            transactions.push({
                id: `sms_${Date.now()}_${i}`,
                description: sms,
                amount: parseInt(match[1]),
                date: new Date().toISOString(),
                type: "debit",
                accountId: "sim_1",
                source: "sms"
            });
        }
    }

    return transactions;
}
