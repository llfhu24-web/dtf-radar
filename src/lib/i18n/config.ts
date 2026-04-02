export const locales = ["en", "zh-Hans", "zh-Hant"] as const;

export type Locale = (typeof locales)[number];

export function resolveLocale(input?: string | null): Locale {
  if (input === "zh-Hans") return "zh-Hans";
  if (input === "zh-Hant") return "zh-Hant";
  return "en";
}

export function isTraditionalChinese(locale: Locale) {
  return locale === "zh-Hant";
}
