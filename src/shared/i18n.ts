import en, { type LocaleKeys } from "./locales/en";
import zhHant from "./locales/zh-Hant";
import ja from "./locales/ja";
import ko from "./locales/ko";
import de from "./locales/de";
import pt from "./locales/pt";
import es from "./locales/es";
import fr from "./locales/fr";

type LocaleMap = Record<LocaleKeys, string>;

const locales: Record<string, LocaleMap> = {
  en,
  "zh-Hant": zhHant,
  ja,
  ko,
  de,
  pt,
  es,
  fr,
};

// navigator.language → locale key mapping
const langMapping: Record<string, string> = {
  "zh-TW": "zh-Hant",
  "zh-HK": "zh-Hant",
  "zh-MO": "zh-Hant",
};

function resolveLocale(): string {
  const browserLang = navigator.language;

  // Exact match (e.g. "zh-TW" → "zh-Hant" via mapping)
  if (langMapping[browserLang]) return langMapping[browserLang];

  // Direct match (e.g. "ja", "ko", "de")
  if (locales[browserLang]) return browserLang;

  // Base language match (e.g. "en-US" → "en", "pt-BR" → "pt")
  const base = browserLang.split("-")[0];
  if (locales[base]) return base;

  return "en";
}

const currentLocale = resolveLocale();
const currentMessages = locales[currentLocale] ?? en;

export function t(key: LocaleKeys): string {
  return currentMessages[key] ?? en[key] ?? key;
}

export function getCurrentLocale(): string {
  return currentLocale;
}
