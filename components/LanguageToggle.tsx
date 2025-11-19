"use client";

import { useTranslation } from "./TranslationProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20"
      aria-label="Toggle language"
    >
      <span className="text-sm font-medium">
        {language === "pt" ? "🇵🇹 PT" : "🇬🇧 EN"}
      </span>
    </button>
  );
}
