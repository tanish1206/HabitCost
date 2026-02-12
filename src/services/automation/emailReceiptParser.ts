import { RawTransaction } from "./types";

const MOCK_EMAILS = [
    "Your order #12345 from AMAZON.IN confirmed. Amount ₹1499 debited.",
    "Netflix Subscription Receipt: ₹649 charged to your card ending 8899.",
    "Your Swiggy order #9988 is confirmed. Total: ₹450 paid via UPI.",
    "Invoice for your ride with UBER: ₹280. Thanks for riding!",
    "Receipt from Apple Services: ₹119 for iCloud Storage.",
];

export async function parseEmailReceipts(): Promise<RawTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Regex to extract amount (simple version for Indian formatted currency)
    const amountRegex = /₹\s?(\d+)/;

    const transactions: RawTransaction[] = [];

    // Randomly pick an email to "process"
    const email = MOCK_EMAILS[Math.floor(Math.random() * MOCK_EMAILS.length)];
    const match = email.match(amountRegex);

    if (match) {
        transactions.push({
            id: `email_${Date.now()}`,
            description: email, // Use full email body as desc for classifier to pick up keywords
            amount: parseInt(match[1]),
            date: new Date().toISOString(),
            type: "debit",
            accountId: "email_linked",
            source: "email"
        });
    }

    return transactions;
}
