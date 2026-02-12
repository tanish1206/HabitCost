import {
  UtensilsCrossed, ShoppingBag, Car, Tv, Coffee, Smartphone,
  Gamepad2, Music, BookOpen, Dumbbell, Pill, Plane,
  type LucideIcon
} from "lucide-react";

export interface HabitApp {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  color: string;
}

export const HABIT_APPS: HabitApp[] = [
  { id: "swiggy", name: "Swiggy", category: "Food Delivery", icon: UtensilsCrossed, color: "hsl(25 95% 52%)" },
  { id: "zomato", name: "Zomato", category: "Food Delivery", icon: UtensilsCrossed, color: "hsl(0 80% 50%)" },
  { id: "myntra", name: "Myntra", category: "Fashion", icon: ShoppingBag, color: "hsl(330 70% 55%)" },
  { id: "uber", name: "Uber", category: "Transport", icon: Car, color: "hsl(0 0% 20%)" },
  { id: "ola", name: "Ola", category: "Transport", icon: Car, color: "hsl(50 90% 50%)" },
  { id: "amazon", name: "Amazon", category: "Shopping", icon: ShoppingBag, color: "hsl(30 90% 50%)" },
  { id: "flipkart", name: "Flipkart", category: "Shopping", icon: ShoppingBag, color: "hsl(220 80% 55%)" },
  { id: "netflix", name: "Netflix", category: "Subscriptions", icon: Tv, color: "hsl(0 75% 45%)" },
  { id: "spotify", name: "Spotify", category: "Subscriptions", icon: Music, color: "hsl(140 65% 45%)" },
  { id: "starbucks", name: "Starbucks", category: "Cafe", icon: Coffee, color: "hsl(155 60% 35%)" },
  { id: "rapido", name: "Rapido", category: "Transport", icon: Car, color: "hsl(38 92% 50%)" },
  { id: "ajio", name: "Ajio", category: "Fashion", icon: ShoppingBag, color: "hsl(270 60% 50%)" },
  { id: "hotstar", name: "Hotstar", category: "Subscriptions", icon: Tv, color: "hsl(220 70% 50%)" },
  { id: "zepto", name: "Zepto", category: "Groceries", icon: ShoppingBag, color: "hsl(280 70% 55%)" },
  { id: "blinkit", name: "Blinkit", category: "Groceries", icon: ShoppingBag, color: "hsl(45 90% 50%)" },
  { id: "phonepe", name: "PhonePe", category: "Payments", icon: Smartphone, color: "hsl(270 80% 45%)" },
  { id: "gpay", name: "Google Pay", category: "Payments", icon: Smartphone, color: "hsl(220 70% 50%)" },
  { id: "cred", name: "CRED", category: "Payments", icon: Smartphone, color: "hsl(0 0% 15%)" },
  { id: "cult", name: "Cult.fit", category: "Fitness", icon: Dumbbell, color: "hsl(0 75% 50%)" },
  { id: "audible", name: "Audible", category: "Subscriptions", icon: BookOpen, color: "hsl(30 80% 50%)" },
];

export interface Expense {
  id: string;
  appId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Goal {
  id: string;
  appId: string;
  targetMonthly: number;
  deadline: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  appId: string;
  spendLimit: number;
  limitType: "daily" | "weekly";
  duration: number;
  startDate: string;
  status: "active" | "completed" | "failed";
}

export interface Alert {
  id: string;
  appId: string;
  type: "limit_exceeded" | "goal_reached" | "challenge_progress" | "spending_spike";
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock data
export const MOCK_EXPENSES: Expense[] = [
  { id: "1", appId: "swiggy", amount: 450, date: "2026-02-12", note: "Dinner" },
  { id: "2", appId: "uber", amount: 280, date: "2026-02-12", note: "Office commute" },
  { id: "3", appId: "zomato", amount: 320, date: "2026-02-11", note: "Lunch" },
  { id: "4", appId: "myntra", amount: 1899, date: "2026-02-10", note: "Jacket" },
  { id: "5", appId: "swiggy", amount: 380, date: "2026-02-10" },
  { id: "6", appId: "netflix", amount: 649, date: "2026-02-01", note: "Monthly sub" },
  { id: "7", appId: "spotify", amount: 119, date: "2026-02-01" },
  { id: "8", appId: "ola", amount: 195, date: "2026-02-09" },
  { id: "9", appId: "starbucks", amount: 520, date: "2026-02-08" },
  { id: "10", appId: "amazon", amount: 2499, date: "2026-02-07", note: "Headphones" },
  { id: "11", appId: "swiggy", amount: 290, date: "2026-02-06" },
  { id: "12", appId: "zepto", amount: 850, date: "2026-02-05", note: "Groceries" },
  { id: "13", appId: "uber", amount: 340, date: "2026-02-04" },
  { id: "14", appId: "zomato", amount: 410, date: "2026-02-03" },
  { id: "15", appId: "swiggy", amount: 550, date: "2026-02-02" },
  { id: "16", appId: "swiggy", amount: 310, date: "2026-01-28" },
  { id: "17", appId: "zomato", amount: 480, date: "2026-01-25" },
  { id: "18", appId: "uber", amount: 220, date: "2026-01-22" },
  { id: "19", appId: "myntra", amount: 3200, date: "2026-01-20" },
  { id: "20", appId: "ola", amount: 175, date: "2026-01-18" },
];

export const MOCK_GOALS: Goal[] = [
  { id: "g1", appId: "swiggy", targetMonthly: 1500, deadline: "2026-03-31", createdAt: "2026-02-01" },
  { id: "g2", appId: "uber", targetMonthly: 800, deadline: "2026-04-30", createdAt: "2026-02-01" },
  { id: "g3", appId: "myntra", targetMonthly: 2000, deadline: "2026-06-30", createdAt: "2026-02-01" },
];

export const MOCK_CHALLENGES: Challenge[] = [
  { id: "c1", appId: "swiggy", spendLimit: 200, limitType: "daily", duration: 14, startDate: "2026-02-05", status: "active" },
  { id: "c2", appId: "zomato", spendLimit: 1000, limitType: "weekly", duration: 30, startDate: "2026-02-01", status: "active" },
];

export function getAppById(id: string): HabitApp | undefined {
  return HABIT_APPS.find(app => app.id === id);
}

export function getExpensesForApp(expenses: Expense[], appId: string): Expense[] {
  return expenses.filter(e => e.appId === appId);
}

export function getMonthlyTotal(expenses: Expense[], month?: string): number {
  const target = month || new Date().toISOString().slice(0, 7);
  return expenses
    .filter(e => e.date.startsWith(target))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getAppMonthlyTotal(expenses: Expense[], appId: string, month?: string): number {
  const target = month || new Date().toISOString().slice(0, 7);
  return expenses
    .filter(e => e.appId === appId && e.date.startsWith(target))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function calculateInvestmentGrowth(monthlyAmount: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
}
