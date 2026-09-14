/* Kinetic Street Signal: the app shell stays dark so lime and orange delivery signals own the visual hierarchy. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import AdminPaymentSettings from "./pages/AdminPaymentSettings";
import OrderCheckout from "./pages/OrderCheckout";
import { useEffect } from "react";

function SPAFallbackRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    // GitHub Pages serves 404.html for unknown routes; the 404 page stored the
    // originally requested path here so we can restore it client-side.
    let target: string | null = null;
    try {
      target = window.sessionStorage.getItem("fm:spa-redirect");
      if (target) window.sessionStorage.removeItem("fm:spa-redirect");
    } catch {
      /* sessionStorage unavailable */
    }
    if (target && target !== "/") {
      setLocation(target, { replace: true });
    }
  }, [setLocation]);
  return null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <SPAFallbackRedirect />
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
