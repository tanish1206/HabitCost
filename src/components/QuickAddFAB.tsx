import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
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
    const [appId, setAppId] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !appId) {
            toast.error("Please enter amount and select an app");
            return;
        }

        const newExpense = {
            id: `manual_${Date.now()}`,
            amount: parseFloat(amount),
            appId,
            date: new Date().toISOString(), // Use current time
            note: note || "Manual Entry",
        };

        onAddExpense(newExpense);
        toast.success("Expense added successfully");
        setOpen(false);

        // Reset form
        setAmount("");
        setAppId("");
        setNote("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="fixed bottom-24 right-5 h-14 w-14 rounded-full shadow-lg z-50 p-0"
                    size="icon"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="app">App / Category</Label>
                        <Select value={appId} onValueChange={setAppId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select app" />
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
                    <div className="grid gap-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Input
                            id="note"
                            placeholder="What was this for?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Add Expense</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
