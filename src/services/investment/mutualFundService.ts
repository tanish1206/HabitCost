export interface MutualFund {
    id: string;
    name: string;
    category: "Equity" | "Debt" | "Hybrid" | "ELSS";
    nav: number;
    returns: {
        "1Y": number;
        "3Y": number;
        "5Y": number;
    };
    risk: "Low" | "Moderate" | "Very High";
    minSip: number;
}

const MOCK_FUNDS: MutualFund[] = [
    {
        id: "mf_1",
        name: "Nippon India Small Cap Fund",
        category: "Equity",
        nav: 145.23,
        returns: { "1Y": 45.2, "3Y": 32.1, "5Y": 28.5 },
        risk: "Very High",
        minSip: 1000
    },
    {
        id: "mf_2",
        name: "Parag Parikh Flexi Cap Fund",
        category: "Equity",
        nav: 78.45,
        returns: { "1Y": 22.5, "3Y": 18.2, "5Y": 19.8 },
        risk: "Moderate",
        minSip: 1000
    },
    {
        id: "mf_3",
        name: "HDFC Balanced Advantage Fund",
        category: "Hybrid",
        nav: 412.10,
        returns: { "1Y": 15.6, "3Y": 12.4, "5Y": 14.2 },
        risk: "Moderate",
        minSip: 500
    },
    {
        id: "mf_4",
        name: "SBI Bluechip Fund",
        category: "Equity",
        nav: 98.32,
        returns: { "1Y": 18.9, "3Y": 15.6, "5Y": 16.1 },
        risk: "Moderate",
        minSip: 2000
    },
    {
        id: "mf_5",
        name: "Quant Active Fund",
        category: "Equity",
        nav: 678.90,
        returns: { "1Y": 38.4, "3Y": 29.1, "5Y": 26.5 },
        risk: "Very High",
        minSip: 1000
    }
];

export async function searchMutualFunds(query: string): Promise<MutualFund[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!query) return MOCK_FUNDS;

    const lowerQuery = query.toLowerCase();
    return MOCK_FUNDS.filter(fund =>
        fund.name.toLowerCase().includes(lowerQuery) ||
        fund.category.toLowerCase().includes(lowerQuery)
    );
}

export async function getFundDetails(id: string): Promise<MutualFund | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_FUNDS.find(f => f.id === id);
}
