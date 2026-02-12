import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";

import Goals from "./pages/Goals";
import Challenges from "./pages/Challenges";
import Analytics from "./pages/Analytics";
import InvestmentComparison from "./pages/InvestmentComparison";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="mx-auto max-w-lg min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/goals" element={<Goals />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/invest" element={<InvestmentComparison />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
