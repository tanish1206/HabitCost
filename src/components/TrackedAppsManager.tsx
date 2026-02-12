import { useState, useEffect } from "react";
import { Check, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Assume shadcn scroll-area exists or use div
import { Switch } from "@/components/ui/switch"; // Assume shadcn switch exists
import { HABIT_APPS, HabitApp } from "@/lib/data";
import { toast } from "sonner";

interface TrackedAppsManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTrackedAppsChange: (ids: string[]) => void;
}

export default function TrackedAppsManager({ open, onOpenChange, onTrackedAppsChange }: TrackedAppsManagerProps) {
    const [trackedIds, setTrackedIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("habitCost_trackedApps");
        if (saved) {
            setTrackedIds(JSON.parse(saved));
        } else {
            // Default: Track everything for now, or maybe just top 3?
            // Let's default to ALL to match initial MVP behavior, user can disable.
            const allIds = HABIT_APPS.map(a => a.id);
            setTrackedIds(allIds);
            localStorage.setItem("habitCost_trackedApps", JSON.stringify(allIds));
        }
    }, []);

    const toggleApp = (id: string) => {
        setTrackedIds(prev => {
            const newIds = prev.includes(id)
                ? prev.filter(tid => tid !== id)
                : [...prev, id];

            localStorage.setItem("habitCost_trackedApps", JSON.stringify(newIds));
            onTrackedAppsChange(newIds);
            return newIds;
        });
    };

    const filteredApps = HABIT_APPS.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-5 py-4 border-b border-border">
                    <DialogTitle>Manage Tracked Apps</DialogTitle>
                    <DialogDescription>
                        Enable tracking for apps to automatically classify transactions.
                    </DialogDescription>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search apps..."
                            className="pl-9 bg-secondary/50 border-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {filteredApps.map(app => {
                        const isTracked = trackedIds.includes(app.id);
                        const Icon = app.icon;
                        return (
                            <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-accent/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: app.color + "20", color: app.color }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{app.name}</p>
                                        <p className="text-xs text-muted-foreground">{app.category}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={isTracked}
                                    onCheckedChange={() => toggleApp(app.id)}
                                />
                            </div>
                        );
                    })}

                    {filteredApps.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            No apps found matching "{searchQuery}"
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
                    <Button className="w-full" onClick={() => onOpenChange(false)}>
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
