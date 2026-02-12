export interface RawTransaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    type: "debit" | "credit";
}

export interface ParsedExpense {
    id: string;
    amount: number;
    date: string;
    appId: string;
    note: string;
}
