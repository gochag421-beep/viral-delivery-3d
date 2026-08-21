import { useLanguage, type Language } from "@/contexts/LanguageContext";

export default function LanguageMenu() {
  const { language, setLanguage } = useLanguage();
  const choose = (next: Language) => setLanguage(next);
  return (
    <div className="language-menu" aria-label="Language selection">
      <button type="button" className={language === "el" ? "language-menu__active" : ""} onClick={() => choose("el")} aria-pressed={language === "el"}>ΕΛ</button>
      <span aria-hidden="true">/</span>
      <button type="button" className={language === "en" ? "language-menu__active" : ""} onClick={() => choose("en")} aria-pressed={language === "en"}>EN</button>
    </div>
  );
}
