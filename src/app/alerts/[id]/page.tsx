import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n/messages";
import { formatDateTime, getLocaleFromSearchParams, translateEventType, withLocale } from "@/lib/i18n/runtime";
import { getAlertById, getRecentAlertsForTrackedPage, getSnapshotsForTrackedPage } from "@/lib/repositories/alert-repository";

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

export default async function AlertDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const locale = getLocaleFromSearchParams(query);
  const t = getMessages(locale);
  const alert = await getAlertById(id, DEFAULT_WORKSPACE_ID);

  if (!alert) {
    notFound();
  }

  const [recentTrackedPageAlerts, recentSnapshots] = await Promise.all([
    getRecentAlertsForTrackedPage(alert.trackedPageId, 5),
    getSnapshotsForTrackedPage(alert.trackedPageId, 5),
  ]);

  const level = getLevel(alert.importanceScore);
  const localizedLevel = level === "High" ? t.alerts.high : level === "Medium" ? t.alerts.medium : t.alerts.low;
  const tags = Array.isArray(alert.tagsJson) ? alert.tagsJson : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <Link href={withLocale("/alerts", locale)} className="text-sm text-zinc-500 transition hover:text-zinc-900">
        ← {t.alerts.back}
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">{translateEventType(alert.eventType, locale)}</span>
          <span className={`rounded-full px-2.5 py-1 ${levelStyles[level]}`}>{localizedLevel}</span>
          <span className="text-zinc-400">{formatDateTime(alert.detectedAt, locale)}</span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950">{alert.title}</h1>
        <p className="mt-3 text-sm text-zinc-500">{alert.competitor.name}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {alert.oldValue ? (
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">{t.alerts.oldValue}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">{alert.oldValue}</p>
            </div>
          ) : null}
          {alert.newValue ? (
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">{t.alerts.newValue}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">{alert.newValue}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{t.alerts.summary}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{alert.summary || t.alerts.noSummary}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t.alerts.whyItMatters}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{alert.details || t.alerts.noSummary}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t.alerts.tags}</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <span key={String(tag)} className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700">
                      {String(tag)}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">{t.alerts.noTags}</p>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t.alerts.trackedPage}</h2>
              <a
                href={alert.trackedPage.url}
                className="mt-3 inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4"
              >
                {alert.trackedPage.title || alert.trackedPage.url}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <h2 className="text-lg font-semibold text-zinc-950">{t.alerts.recentSnapshotHistory}</h2>
              <div className="mt-4 space-y-3">
                {recentSnapshots.length > 0 ? (
                  recentSnapshots.map((snapshot) => (
                    <div key={snapshot.id} className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-zinc-400">{formatDateTime(snapshot.fetchedAt, locale)}</p>
                        {snapshot.price ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                            {snapshot.price}
                          </span>
                        ) : null}
                      </div>
                      {snapshot.ctaText ? (
                        <p className="mt-2 text-xs text-zinc-600">
                          <span className="font-medium text-zinc-800">CTA:</span> {snapshot.ctaText}
                        </p>
                      ) : null}
                      {snapshot.title ? (
                        <p className="mt-2 text-xs text-zinc-600">
                          <span className="font-medium text-zinc-800">Title:</span> {snapshot.title}
                        </p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">{t.alerts.noSnapshots}</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <h2 className="text-lg font-semibold text-zinc-950">{t.alerts.recentPageAlertHistory}</h2>
              <div className="mt-4 space-y-3">
                {recentTrackedPageAlerts.length > 0 ? (
                  recentTrackedPageAlerts.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
                        <span>{translateEventType(item.eventType, locale)}</span>
                        <span>•</span>
                        <span>{formatDateTime(item.detectedAt, locale)}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-zinc-900">{item.title}</p>
                      <p className="mt-2 text-xs leading-5 text-zinc-600">{item.summary || t.alerts.noSummary}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">{t.alerts.noTrackedPageAlertHistory}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
