import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "el" | "en";

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void };

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "el";
    return window.localStorage.getItem("fastmovment-language") === "en" ? "en" : "el";
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("fastmovment-language", next);
    document.documentElement.lang = next;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
