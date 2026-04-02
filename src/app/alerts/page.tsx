import Link from "next/link";
import { listAlerts } from "@/lib/repositories/alert-repository";
import { getMessages } from "@/lib/i18n/messages";
import { formatDateTime, getLocaleFromSearchParams, translateEventType, withLocale } from "@/lib/i18n/runtime";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

const levelStyles: Record<string, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-zinc-100 text-zinc-700",
};

function getLevel(score: number) {
  if (score >= 8) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromSearchParams(params);
  const t = getMessages(locale);
  let alerts = [] as Awaited<ReturnType<typeof listAlerts>>;

  try {
    alerts = await listAlerts(DEFAULT_WORKSPACE_ID);
  } catch {
    alerts = [];
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div>
        <p className="text-sm text-zinc-500">{t.alerts.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{t.alerts.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          {t.alerts.subtitle}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <button className="rounded-full bg-zinc-950 px-4 py-2 text-white">{t.alerts.allAlerts}</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{t.alerts.priceChanges}</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{t.alerts.newProducts}</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{t.alerts.promotions}</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">{t.alerts.messaging}</button>
      </div>

      <div className="mt-8 space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const level = getLevel(alert.importanceScore);
            const localizedLevel = level === "High" ? t.alerts.high : level === "Medium" ? t.alerts.medium : t.alerts.low;

            return (
              <article key={alert.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">{translateEventType(alert.eventType, locale)}</span>
                      <span className={`rounded-full px-2.5 py-1 ${levelStyles[level]}`}>{localizedLevel}</span>
                      <span className="text-zinc-400">{formatDateTime(alert.detectedAt, locale)}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-950">{alert.title}</h2>
                    <p className="text-sm text-zinc-500">{alert.competitor.name}</p>
                    <p className="max-w-3xl text-sm leading-7 text-zinc-600">
                      {alert.summary || t.alerts.noSummary}
                    </p>
                  </div>
                  <Link
                    href={withLocale(`/alerts/${alert.id}`, locale)}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    {t.alerts.viewDetail}
                  </Link>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-sm text-zinc-500 shadow-sm">
            {t.alerts.empty}
          </div>
        )}
      </div>
    </main>
  );
}
