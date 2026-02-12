export interface MutualFund {
    id: string;
    name: string;
    category: string;
    nav: number;
    returns: {
        "1Y": number;
        "3Y": number;
        "5Y": number;
    };
    risk: "Low" | "Moderate" | "High";
}

const MOCK_FUNDS: MutualFund[] = [
    {
        id: "mf_1",
        name: "Nippon India Small Cap Fund",
        category: "Equity Small Cap",
        nav: 184.5,
        returns: { "1Y": 48.5, "3Y": 35.2, "5Y": 28.9 },
        risk: "High"
    },
    {
        id: "mf_2",
        name: "HDFC Top 100 Fund",
        category: "Equity Large Cap",
        nav: 982.1,
        returns: { "1Y": 22.1, "3Y": 18.5, "5Y": 15.2 },
        risk: "Moderate"
    },
    {
        id: "mf_3",
        name: "Parag Parikh Flexi Cap Fund",
        category: "Equity Flexi Cap",
        nav: 75.4,
        returns: { "1Y": 28.5, "3Y": 22.1, "5Y": 20.4 },
        risk: "Moderate"
    },
    {
        id: "mf_4",
        name: "SBI Contra Fund",
        category: "Equity Contra",
        nav: 345.2,
        returns: { "1Y": 35.8, "3Y": 29.5, "5Y": 24.1 },
        risk: "High"
    },
    {
        id: "mf_5",
        name: "ICICI Prudential Bluechip Fund",
        category: "Equity Large Cap",
        nav: 98.5,
        returns: { "1Y": 18.5, "3Y": 15.2, "5Y": 13.5 },
        risk: "Moderate"
    }
];

export async function searchFunds(query: string): Promise<MutualFund[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
    if (!query) return MOCK_FUNDS;

    const lowerQuery = query.toLowerCase();
    return MOCK_FUNDS.filter(f =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.category.toLowerCase().includes(lowerQuery)
    );
}

export async function getFundDetails(id: string): Promise<MutualFund | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_FUNDS.find(f => f.id === id);
}
