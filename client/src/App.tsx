/* Kinetic Street Signal: the app shell stays dark so lime and orange delivery signals own the visual hierarchy. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import AdminPaymentSettings from "./pages/AdminPaymentSettings";
import OrderCheckout from "./pages/OrderCheckout";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/payments" component={AdminPaymentSettings} />
      <Route path="/order" component={OrderCheckout} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster theme="dark" />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
