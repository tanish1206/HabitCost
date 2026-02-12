// TODO: Replace SMS parser with Android SMS permission module
import { RawTransaction } from "./types";

const MOCK_SMS_TEMPLATES = [
    "Rs {amount} spent on {merchant} using HDFC Bank Credit Card ending 1234.",
    "INR {amount} debited for {merchant} via UPI. Ref 998877.",
    "Rs.{amount} paid to {merchant} from Acct XX99.",
    "Transaction Alert: {amount} INR debited at {merchant}.",
];

const MERCHANTS = ["ZOMATO", "SWIGGY", "UBER", "NETFLIX.COM", "AMAZON", "JIO PREPAID"];

export async function fetchSmsTransactions(): Promise<RawTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const transactions: RawTransaction[] = [];
    const numSms = Math.floor(Math.random() * 3) + 1; // 1 to 3 SMS

    for (let i = 0; i < numSms; i++) {
        const merchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
        const amount = Math.floor(Math.random() * 1000) + 100;
        const template = MOCK_SMS_TEMPLATES[Math.floor(Math.random() * MOCK_SMS_TEMPLATES.length)];

        const sms = template.replace("{amount}", amount.toString()).replace("{merchant}", merchant);

        // Regex parsing logic mimicking real-world scenario
        // 1. Extract Amount (Rs 349, INR 1200, Rs.799)
        const amountRegex = /(?:Rs|INR)\.?\s*(\d+(?:\.\d{2})?)/i;
        // 2. Extract Merchant (naive assumption: usually after 'on', 'for', 'to', 'at')
        const merchantRegex = /(?:on|for|to|at)\s+([A-Z0-9\s.]+?)(?:\s+(?:using|via|from|$))/i;

        const amountMatch = sms.match(amountRegex);
        // In real app, we would use the capture group, but here we already inserted the values. 
        // We are simulating the "Parsing" step returning valid data.

        if (amountMatch) {
            // Date within last 5 days for SMS
            const pastDays = Math.floor(Math.random() * 5);
            const date = new Date();
            date.setDate(date.getDate() - pastDays);

            transactions.push({
                id: `sms_${Date.now()}_${i}`,
                description: sms,
                amount: parseInt(amountMatch[1]), // Use parsed amount
                date: date.toISOString(),
                type: "debit",
                accountId: "sim_1",
                source: "sms"
            });
        }
    }

    return transactions;
}
