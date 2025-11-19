"use client";

import { useTranslation } from "./TranslationProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-300 border border-blue-400/20 hover:border-blue-400/40"
      aria-label="Toggle language"
    >
      <span className="text-sm font-medium">
        {language === "pt" ? "🇵🇹 PT" : "🇬🇧 EN"}
      </span>
    </button>
  );
}
