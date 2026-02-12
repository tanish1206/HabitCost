import { HABIT_APPS } from "@/lib/data";

interface MerchantRule {
    keyword: string;
    appId: string;
}

const MERCHANT_RULES: MerchantRule[] = [
    { keyword: "SWIGGY", appId: "swiggy" },
    { keyword: "ZOMATO", appId: "zomato" },
    { keyword: "UBER", appId: "uber" },
    { keyword: "OLA", appId: "ola" },
    { keyword: "RAPIDO", appId: "rapido" },
    { keyword: "AMAZON", appId: "amazon" },
    { keyword: "FLIPKART", appId: "flipkart" },
    { keyword: "NETFLIX", appId: "netflix" },
    { keyword: "SPOTIFY", appId: "spotify" },
    { keyword: "STARBUCKS", appId: "starbucks" },
    { keyword: "MYNTRA", appId: "myntra" },
    { keyword: "AJIO", appId: "ajio" },
    { keyword: "ZEPTO", appId: "zepto" },
    { keyword: "BLINKIT", appId: "blinkit" },
    { keyword: "CRED", appId: "cred" },
    { keyword: "CULT", appId: "cult" },
    { keyword: "AUDIBLE", appId: "audible" },
    // Generic fallbacks
    { keyword: "FOOD", appId: "zomato" }, // Fallback to a food app
    { keyword: "CAB", appId: "uber" },
];

export function classifyMerchant(description: string): string | null {
    const fileDesc = description.toUpperCase();

    for (const rule of MERCHANT_RULES) {
        if (fileDesc.includes(rule.keyword)) {
            return rule.appId;
        }
    }

    return null;
}

export function enhanceTransaction(rawTx: any) {
    const appId = classifyMerchant(rawTx.description);
    return {
        ...rawTx,
        appId: appId || "other", // 'other' or keep null if we want to prompt user
        category: appId ? HABIT_APPS.find(a => a.id === appId)?.category : "Uncategorized"
    };
}
