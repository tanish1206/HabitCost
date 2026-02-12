import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HABIT_APPS } from "@/lib/data";
import { toast } from "sonner";

interface QuickAddFABProps {
    onAddExpense: (expense: any) => void;
}

export default function QuickAddFAB({ onAddExpense }: QuickAddFABProps) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [appId, setAppId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !appId) {
            toast.error("Please fill in amount and category");
            return;
        }

        const newExpense = {
            id: Math.random().toString(36).substr(2, 9),
            amount: parseFloat(amount),
            appId,
            date: new Date().toISOString(),
            note: description || "Manual Entry",
        };

        onAddExpense(newExpense);
        toast.success("Expense added manually");
        setOpen(false);
        setAmount("");
        setDescription("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    className="fixed bottom-24 right-5 h-14 w-14 rounded-full shadow-lg z-50 animate-in fade-in zoom-in duration-300"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Quick Add Expense</DialogTitle>
                    <DialogDescription>
                        For cash or untracked manual expenses.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder="0.00"
                            autoFocus
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            App/Cat
                        </Label>
                        <Select value={appId} onValueChange={setAppId}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {HABIT_APPS.map((app) => (
                                    <SelectItem key={app.id} value={app.id}>
                                        <div className="flex items-center gap-2">
                                            <app.icon className="h-4 w-4" style={{ color: app.color }} />
                                            {app.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right">
                            Note
                        </Label>
                        <Input
                            id="desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Dinner, Taxi, etc."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Expense</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
