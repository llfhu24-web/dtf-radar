import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages } from "@/lib/i18n/messages";
import {
  formatDateTime,
  getLocaleFromSearchParams,
  translateCompetitorStatus,
  translateCrawlStatus,
  translateEventType,
  withLocale,
} from "@/lib/i18n/runtime";
import { getCompetitorById } from "@/lib/repositories/competitor-repository";
import { CrawlMonitorButton } from "./crawl-monitor-button";
import { CrawlTrackedPageButton } from "./crawl-tracked-page-button";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

const eventToneStyles: Record<string, string> = {
  "Price change": "bg-emerald-50 text-emerald-700",
  "CTA change": "bg-blue-50 text-blue-700",
  "Messaging change": "bg-amber-50 text-amber-700",
  "Content update": "bg-violet-50 text-violet-700",
  "Initial snapshot": "bg-zinc-100 text-zinc-700",
};

type CompetitorDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export default async function CompetitorDetailPage({ params, searchParams }: CompetitorDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const locale = getLocaleFromSearchParams(query);
  const t = getMessages(locale);
  const competitor = await getCompetitorById(id, DEFAULT_WORKSPACE_ID);

  if (!competitor) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link href={withLocale("/competitors", locale)} className="text-sm text-zinc-500 transition hover:text-zinc-900">
        ← {t.competitors.back}
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
              {competitor.region || t.competitors.unknownRegion}
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{competitor.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                {competitor.note || t.competitors.noNotes}
              </p>
            </div>
            <a
              href={competitor.websiteUrl}
              className="inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4"
            >
              {competitor.websiteUrl}
            </a>
            <div className="pt-2">
              <CrawlMonitorButton competitorId={competitor.id} locale={locale} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">{t.competitors.monitoredPages}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{competitor.trackedPages.length}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">{t.competitors.changes7d}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{competitor.changeEvents.length}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">{t.competitors.status}</p>
              <p className="mt-2 text-xl font-semibold text-zinc-950">{translateCompetitorStatus(competitor.status, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t.competitors.trackedPagesTitle}</h2>
            <p className="text-xs text-zinc-400">{t.competitors.trackedPagesSubtitle}</p>
          </div>
          <div className="mt-5 space-y-4">
            {competitor.trackedPages.length > 0 ? (
              competitor.trackedPages.map((page) => {
                const latestSnapshot = page.snapshots[0] ?? null;
                const latestCrawlJob = page.crawlJobs[0] ?? null;
                const latestChangeEvent = page.changeEvents[0] ?? null;
                const eventTone = latestChangeEvent?.eventType
                  ? (eventToneStyles[latestChangeEvent.eventType] ?? "bg-zinc-100 text-zinc-700")
                  : "bg-zinc-100 text-zinc-700";

                return (
                  <div key={page.id} className="rounded-2xl border border-zinc-200 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{page.title || page.url}</p>
                        <p className="mt-1 text-xs text-zinc-500">{page.pageType}</p>
                        <p className="mt-2 break-all text-xs text-zinc-400">{page.url}</p>
                      </div>
                      <div className="space-y-3 sm:text-right">
                        <div className="flex flex-wrap gap-2 text-xs sm:justify-end">
                          {latestSnapshot?.price ? (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                              {t.competitors.priceLabel}: {latestSnapshot.price}
                            </span>
                          ) : null}
                          {latestSnapshot?.ctaText ? (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                              {t.competitors.ctaLabel}: {latestSnapshot.ctaText}
                            </span>
                          ) : null}
                          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">
                            {t.competitors.crawlLabel}: {latestCrawlJob?.status ? translateCrawlStatus(latestCrawlJob.status, locale) : t.competitors.notRun}
                          </span>
                        </div>
                        <CrawlTrackedPageButton trackedPageId={page.id} locale={locale} />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-xs text-zinc-500 sm:grid-cols-2">
                      <div className="rounded-2xl bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200">
                        <p className="text-zinc-400">{t.competitors.lastFetched}</p>
                        <p className="mt-1 font-medium text-zinc-700">
                          {formatDateTime(latestSnapshot?.fetchedAt, locale)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200">
                        <p className="text-zinc-400">{t.competitors.lastCrawlResult}</p>
                        <p className="mt-1 font-medium text-zinc-700">
                          {latestCrawlJob?.httpStatus ? `HTTP ${latestCrawlJob.httpStatus}` : latestCrawlJob?.status ? translateCrawlStatus(latestCrawlJob.status, locale) : "—"}
                        </p>
                      </div>
                    </div>

                    {latestChangeEvent ? (
                      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`rounded-full px-2.5 py-1 ${eventTone}`}>
                            {translateEventType(latestChangeEvent.eventType, locale)}
                          </span>
                          <span className="text-zinc-400">{formatDateTime(latestChangeEvent.detectedAt, locale)}</span>
                        </div>
                        <p className="mt-3 text-sm font-medium text-zinc-900">{latestChangeEvent.title}</p>
                        <p className="mt-2 text-xs leading-5 text-zinc-600">
                          {latestChangeEvent.summary || t.competitors.noSummary}
                        </p>
                        {latestChangeEvent.oldValue || latestChangeEvent.newValue ? (
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200">
                              <p className="text-[11px] text-zinc-400">{t.competitors.previous}</p>
                              <p className="mt-1 text-xs font-medium text-zinc-700">{latestChangeEvent.oldValue || "—"}</p>
                            </div>
                            <div className="rounded-2xl bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200">
                              <p className="text-[11px] text-zinc-400">{t.competitors.current}</p>
                              <p className="mt-1 text-xs font-medium text-zinc-700">{latestChangeEvent.newValue || "—"}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {page.snapshots.length > 0 ? (
                      <div className="mt-4 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                            {t.competitors.snapshotTimeline}
                          </h3>
                          <span className="text-[11px] text-zinc-400">{t.competitors.last3Captures}</span>
                        </div>
                        <div className="mt-3 space-y-3">
                          {page.snapshots.map((snapshot) => (
                            <div key={snapshot.id} className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="text-zinc-400">{formatDateTime(snapshot.fetchedAt, locale)}</span>
                                <div className="flex flex-wrap gap-2">
                                  {snapshot.price ? (
                                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                                      {snapshot.price}
                                    </span>
                                  ) : null}
                                  {snapshot.ctaText ? (
                                    <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                                      {snapshot.ctaText}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              {snapshot.title ? (
                                <p className="mt-2 text-xs text-zinc-600">
                                  <span className="font-medium text-zinc-800">{t.competitors.pageTitleLabel}:</span> {snapshot.title}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {page.changeEvents.length > 0 ? (
                      <div className="mt-4 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                            {t.competitors.eventTimeline}
                          </h3>
                          <span className="text-[11px] text-zinc-400">{t.competitors.last3Events}</span>
                        </div>
                        <div className="mt-3 space-y-3">
                          {page.changeEvents.map((event) => {
                            const tone = eventToneStyles[event.eventType] ?? "bg-zinc-100 text-zinc-700";

                            return (
                              <div key={event.id} className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className={`rounded-full px-2 py-1 ${tone}`}>{translateEventType(event.eventType, locale)}</span>
                                  <span className="text-zinc-400">{formatDateTime(event.detectedAt, locale)}</span>
                                </div>
                                <p className="mt-2 text-xs font-medium text-zinc-900">{event.title}</p>
                                <p className="mt-2 text-xs leading-5 text-zinc-600">
                                  {event.summary || t.competitors.noSummary}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-500">
                {t.competitors.noTrackedPages}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t.competitors.recentChangeEvents}</h2>
            <Link href={withLocale("/alerts", locale)} className="text-sm text-zinc-500 transition hover:text-zinc-900">
              {t.competitors.viewAllAlerts}
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {competitor.changeEvents.length > 0 ? (
              competitor.changeEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-zinc-200 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
                    <span>{translateEventType(event.eventType, locale)}</span>
                    <span>•</span>
                    <span>{formatDateTime(event.detectedAt, locale)}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-950">{event.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{event.summary || t.competitors.noSummary}</p>
                  {event.oldValue || event.newValue ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200">
                        <p className="text-xs text-zinc-400">{t.competitors.previous}</p>
                        <p className="mt-1 text-sm font-medium text-zinc-700">{event.oldValue || "—"}</p>
                      </div>
                      <div className="rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200">
                        <p className="text-xs text-zinc-400">{t.competitors.current}</p>
                        <p className="mt-1 text-sm font-medium text-zinc-700">{event.newValue || "—"}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                {t.competitors.noSummary}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
