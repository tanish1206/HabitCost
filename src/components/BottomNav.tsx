import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Target, Flame, BarChart3, TrendingUp, Bell } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/add", icon: PlusCircle, label: "Add" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/challenges", icon: Flame, label: "Challenges" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/invest", icon: TrendingUp, label: "Invest" },
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_6px_hsl(15_90%_58%/0.5)]" : ""}`} />
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
