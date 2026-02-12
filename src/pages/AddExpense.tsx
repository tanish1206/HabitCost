import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HABIT_APPS, formatCurrency, getAppById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AddExpense() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!selectedApp || !amount) {
      toast.error("Please select an app and enter an amount");
      return;
    }
    const app = getAppById(selectedApp);
    toast.success(`Added ${formatCurrency(Number(amount))} for ${app?.name}`);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Add Expense</h1>
        <p className="text-sm text-muted-foreground mt-1">Log your spending</p>
      </header>

      {/* Amount */}
      <div className="px-5 mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">₹</span>
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 h-14 text-2xl font-bold bg-card border-border"
          />
        </div>
      </div>

      {/* App Selection */}
      <div className="px-5 mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-3 block">Select App</label>
        <div className="grid grid-cols-4 gap-2">
          {HABIT_APPS.slice(0, 16).map(app => {
            const Icon = app.icon;
            const active = selectedApp === app.id;
            return (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: app.color + "22", color: app.color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-medium truncate w-full text-center">{app.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="px-5 mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Note (optional)</label>
        <Textarea
          placeholder="What was this for?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-card border-border"
        />
      </div>

      {/* Submit */}
      <div className="px-5">
        <Button onClick={handleSubmit} className="w-full h-12 text-base font-semibold gradient-primary border-0">
          Add Expense
        </Button>
      </div>
    </div>
  );
}
