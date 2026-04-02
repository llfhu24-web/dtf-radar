import type { Locale } from "./config";
import { resolveLocale } from "./config";
import { getMessages } from "./messages";

export function getLocaleFromSearchParams(searchParams?: { lang?: string }) {
  return resolveLocale(searchParams?.lang);
}

export function withLocale(path: string, locale: Locale) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${locale}`;
}

export function swapLocaleInPath(path: string, locale: Locale) {
  const [pathname, queryString] = path.split("?");
  const params = new URLSearchParams(queryString ?? "");
  params.set("lang", locale);
  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}

export function getIntlLocale(locale: Locale) {
  if (locale === "zh-Hans") return "zh-CN";
  return locale === "zh-Hant" ? "zh-Hant-TW" : "en-US";
}

export function formatDateTime(value: Date | string | null | undefined, locale: Locale) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatWeekday(value: Date | string, locale: Locale) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    weekday: "short",
  }).format(date);
}

export function translateEventType(eventType: string, locale: Locale) {
  if (locale === "zh-Hant") {
    switch (eventType) {
      case "Price change":
        return "價格變化";
      case "CTA change":
        return "CTA 變化";
      case "Messaging change":
        return "文案變化";
      case "Content update":
        return "內容更新";
      case "Initial snapshot":
        return "初始快照";
      default:
        return eventType;
    }
  }

  if (locale === "zh-Hans") {
    switch (eventType) {
      case "Price change":
        return "价格变化";
      case "CTA change":
        return "CTA 变化";
      case "Messaging change":
        return "文案变化";
      case "Content update":
        return "内容更新";
      case "Initial snapshot":
        return "初始快照";
      default:
        return eventType;
    }
  }

  return eventType;
}

export function translateCompetitorStatus(status: string, locale: Locale) {
  const t = getMessages(locale);

  switch (status) {
    case "Active":
      return locale === "en" ? t.dashboard.competitorStatusActive : t.competitors.statusActive;
    case "Paused":
      return locale === "en" ? t.dashboard.competitorStatusPaused : t.competitors.statusPaused;
    default:
      return status;
  }
}

export function translateCrawlStatus(status: string, locale: Locale) {
  const t = getMessages(locale);

  switch (status) {
    case "completed":
    case "Completed":
      return locale === "en" ? t.dashboard.crawlStatusCompleted : t.competitors.crawlStatusCompleted;
    case "failed":
    case "Failed":
      return locale === "en" ? t.dashboard.crawlStatusFailed : t.competitors.crawlStatusFailed;
    case "running":
    case "Running":
      return locale === "en" ? t.dashboard.crawlStatusRunning : t.competitors.crawlStatusRunning;
    case "pending":
    case "Pending":
      return locale === "en" ? t.dashboard.crawlStatusPending : t.competitors.crawlStatusPending;
    default:
      return status;
  }
}
