import { createContext, useContext, type ReactNode } from "react";
import { zh, type TranslationKey } from "./locales/zh";
import { en } from "./locales/en";
import { useSettingsStore } from "@/stores/settingsStore";

type Language = "zh" | "en";

const translations: Record<Language, Record<TranslationKey, string>> = {
  zh,
  en,
};

function resolveLanguage(lang: Language | "system"): Language {
  if (lang === "system") {
    return navigator.language.startsWith("zh") ? "zh" : "en";
  }
  return lang;
}

interface I18nContextValue {
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  locale: Language;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const language = useSettingsStore((s) => s.settings.language);
  const locale = resolveLanguage(language);
  const dict = translations[locale];

  const t = (
    key: TranslationKey,
    params?: Record<string, string | number>,
  ): string => {
    let text = dict[key] ?? zh[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  };

  return <I18nContext.Provider value={{ t, locale }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}

export type { Language };
