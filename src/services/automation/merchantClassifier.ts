import { ClassificationResult } from "./types";

interface MerchantRule {
    keywords: string[];
    appId: string;
    category: string;
    weight: number; // 0.1 to 1.0 (Exact match vs partial)
}

const MERCHANT_RULES: MerchantRule[] = [
    { keywords: ["SWIGGY"], appId: "swiggy", category: "Food Delivery", weight: 0.9 },
    { keywords: ["ZOMATO"], appId: "zomato", category: "Food Delivery", weight: 0.9 },
    { keywords: ["UBER"], appId: "uber", category: "Transport", weight: 0.8 },
    { keywords: ["OLA"], appId: "ola", category: "Transport", weight: 0.8 },
    { keywords: ["RAPIDO"], appId: "rapido", category: "Transport", weight: 0.8 },
    { keywords: ["AMAZON"], appId: "amazon", category: "Shopping", weight: 0.7 }, // Could be AWS
    { keywords: ["AMAZON PAY"], appId: "amazon", category: "Shopping", weight: 0.9 },
    { keywords: ["FLIPKART"], appId: "flipkart", category: "Shopping", weight: 0.9 },
    { keywords: ["NETFLIX"], appId: "netflix", category: "Entertainment", weight: 0.95 },
    { keywords: ["SPOTIFY"], appId: "spotify", category: "Entertainment", weight: 0.95 },
    { keywords: ["STARBUCKS"], appId: "starbucks", category: "Food & Drink", weight: 0.9 },
    { keywords: ["MYNTRA"], appId: "myntra", category: "Fashion", weight: 0.9 },
    { keywords: ["ZEPTO"], appId: "zepto", category: "Groceries", weight: 0.9 },
    { keywords: ["BLINKIT"], appId: "blinkit", category: "Groceries", weight: 0.9 },
    { keywords: ["CRED"], appId: "cred", category: "Payments", weight: 0.8 },
];

export function classifyTransaction(description: string): ClassificationResult {
    const normalizedDesc = description.toUpperCase();

    let bestMatch: ClassificationResult = {
        appId: null,
        category: null,
        confidence: 0
    };

    // TODO: Replace rule engine with ML merchant classifier
    for (const rule of MERCHANT_RULES) {
        if (rule.keywords.some(k => normalizedDesc.includes(k))) {
            // Simple confidence calculation
            // Exact match bonus
            const isExact = rule.keywords.some(k => normalizedDesc === k);
            const confidence = isExact ? 1.0 : rule.weight;

            if (confidence > bestMatch.confidence) {
                bestMatch = {
                    appId: rule.appId,
                    category: rule.category,
                    confidence
                };
            }
        }
    }

    return bestMatch;
}
