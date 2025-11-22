import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import { AppProvider } from "@/contexts/AppContext";
import HomePage from "@/pages/HomePage";
import Registration from "@/pages/Registration";
import ResidentDashboard from "@/pages/ResidentDashboard";
import CollectorDashboard from "@/pages/CollectorDashboard";
import AuthorityDashboard from "@/pages/AuthorityDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/register/:role" component={Registration} />
      <Route path="/resident" component={ResidentDashboard} />
      <Route path="/collector" component={CollectorDashboard} />
      <Route path="/authority" component={AuthorityDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AppProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
