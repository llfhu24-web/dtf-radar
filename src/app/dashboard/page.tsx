import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { getDashboardSummary } from "@/lib/repositories/dashboard-repository";
import { filterGroups } from "@/lib/mock-data";
import { getMessages } from "@/lib/i18n/messages";
import {
  formatDateTime,
  formatWeekday,
  getLocaleFromSearchParams,
  translateCompetitorStatus,
  translateCrawlStatus,
  translateEventType,
  withLocale,
} from "@/lib/i18n/runtime";
import { RunAllCrawlButton } from "./run-all-crawl-button";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromSearchParams(params);
  const t = getMessages(locale);
  const summary = await getDashboardSummary(DEFAULT_WORKSPACE_ID);
  const maxAlerts = Math.max(...summary.trends.map((item) => item.alerts), 1);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <PageHeader
        eyebrow={t.dashboard.eyebrow}
        title={t.dashboard.title}
        action={
          <Link
            href={withLocale("/alerts", locale)}
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            {t.dashboard.viewAllAlerts}
          </Link>
        }
      />

      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">{t.dashboard.monitoringControl}</h2>
              <p className="mt-1 text-sm text-zinc-500">{t.dashboard.monitoringSubtitle}</p>
            </div>
            {summary.latestGlobalRunStats ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200">
                  <p className="text-xs text-zinc-400">{t.dashboard.lastRun}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-800">
                    {formatDateTime(summary.latestGlobalRunStats.createdAt, locale)}
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200">
                  <p className="text-xs text-zinc-400">{t.dashboard.coverage}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-800">
                    {summary.latestGlobalRunStats.totalCompetitors} {t.nav.competitors} / {summary.latestGlobalRunStats.totalPages} {t.dashboard.pages}
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200">
                  <p className="text-xs text-zinc-400">{t.dashboard.changesDetected}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-800">
                    {summary.latestGlobalRunStats.changedCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200">
                  <p className="text-xs text-zinc-400">{t.dashboard.runStatus}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-800">
                    {translateCrawlStatus(summary.latestGlobalRunStats.status, locale) || "—"}
                    {summary.latestGlobalRunStats.failedCount > 0
                      ? ` · ${summary.latestGlobalRunStats.failedCount} ${t.dashboard.failedSuffix}`
                      : ` · ${t.dashboard.zeroFailed}`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-500 ring-1 ring-zinc-200">
                {t.dashboard.noGlobalRun}
              </div>
            )}
          </div>
          <RunAllCrawlButton locale={locale} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.dashboard.filters}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t.dashboard.filterSubtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex flex-wrap gap-2">
            {filterGroups.ranges.map((item) => (
              <button
                key={item}
                className={`rounded-full px-4 py-2 ${item === "7d" ? "bg-zinc-950 text-white" : "border border-zinc-300 text-zinc-700"}`}
              >
                {item === "7d" ? t.dashboard.filterRange7d : item === "30d" ? t.dashboard.filterRange30d : t.dashboard.filterRange90d}
              </button>
            ))}
          </div>
          <select className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700 outline-none">
            {filterGroups.types.map((item) => (
              <option key={item}>
                {item === "All"
                  ? t.dashboard.filterTypeAll
                  : item === "Price change"
                    ? t.dashboard.filterTypePriceChange
                    : item === "New product"
                      ? t.dashboard.filterTypeNewProduct
                      : item === "Promotion update"
                        ? t.dashboard.filterTypePromotionUpdate
                        : t.dashboard.filterTypeMessagingShift}
              </option>
            ))}
          </select>
          <select className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700 outline-none">
            {filterGroups.regions.map((item) => (
              <option key={item}>{item === "All regions" ? t.dashboard.filterRegionAll : item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.stats.map((item) => {
          const localizedLabel =
            item.label === "Competitors"
              ? t.dashboard.statsCompetitors
              : item.label === "Tracked pages"
                ? t.dashboard.statsTrackedPages
                : item.label === "Alerts in 7d"
                  ? t.dashboard.statsAlerts7d
                  : t.dashboard.statsHighPriorityAlerts;

          return <StatCard key={item.label} label={localizedLabel} value={item.value} />;
        })}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t.dashboard.alertVolumeTrend}</h2>
              <p className="mt-1 text-sm text-zinc-500">{t.dashboard.alertVolumeSubtitle}</p>
            </div>
            <Badge>{t.dashboard.last7Days}</Badge>
          </div>

          <div className="mt-8 grid grid-cols-7 items-end gap-4">
            {summary.trends.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className="flex h-48 items-end">
                  <div
                    className="w-10 rounded-t-2xl bg-zinc-950"
                    style={{ height: `${(item.alerts / maxAlerts) * 100}%` }}
                  />
                </div>
                <div className="text-center text-xs text-zinc-500">
                  <div>{formatWeekday(item.label, locale)}</div>
                  <div className="mt-1 font-medium text-zinc-700">{item.alerts}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{t.dashboard.topThemes}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t.dashboard.topThemesSubtitle}</p>
          <div className="mt-6 space-y-4">
            {summary.themes.length > 0 ? (
              summary.themes.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700">{item.label}</span>
                    <span className="font-medium text-zinc-900">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white ring-1 ring-zinc-200">
                    <div className="h-2 rounded-full bg-zinc-950" style={{ width: `${item.value * 10}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">{t.dashboard.noThemes}</p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t.dashboard.latestImportantAlerts}</h2>
              <p className="mt-1 text-sm text-zinc-500">{t.dashboard.latestImportantAlertsSubtitle}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {summary.latestAlerts.length > 0 ? (
              summary.latestAlerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-zinc-200 p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
                    <Badge>{translateEventType(alert.eventType, locale)}</Badge>
                    <Badge variant={alert.importanceScore >= 8 ? "high" : alert.importanceScore >= 4 ? "medium" : "low"}>
                      {alert.importanceScore >= 8 ? t.dashboard.high : alert.importanceScore >= 4 ? t.dashboard.medium : t.dashboard.low}
                    </Badge>
                    <span className="text-zinc-400">{formatDateTime(alert.detectedAt, locale)}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-950">{alert.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{alert.competitor.name}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{alert.summary || t.alerts.noSummary}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-zinc-200 p-5 text-sm text-zinc-500">
                {t.dashboard.noAlerts}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{t.dashboard.mostActiveCompetitors}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t.dashboard.mostActiveCompetitorsSubtitle}</p>
          <div className="mt-6 space-y-4">
            {summary.activeCompetitors.length > 0 ? (
              summary.activeCompetitors.map((competitor) => (
                <div key={competitor.id} className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-950">{competitor.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{competitor.region || "—"}</p>
                    </div>
                    <Badge>{translateCompetitorStatus(competitor.status, locale)}</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {competitor.note || t.dashboard.noNotes}
                  </p>
                  <div className="mt-4 flex items-center gap-6 text-sm text-zinc-500">
                    <span>{competitor.monitoredPages} {t.dashboard.pages}</span>
                    <span>{competitor.changes7d} {t.dashboard.changes7d}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white p-5 text-sm text-zinc-500 ring-1 ring-zinc-200">
                {t.dashboard.noCompetitors}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
