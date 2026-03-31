import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  alerts,
  categoryInsights,
  competitors,
  dashboardStats,
  filterGroups,
  trendData,
} from "@/lib/mock-data";

const maxAlerts = Math.max(...trendData.map((item) => item.alerts));

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Market overview"
        action={
          <Link
            href="/alerts"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            View all alerts
          </Link>
        }
      />

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Filters</h2>
          <p className="mt-1 text-sm text-zinc-500">Mock controls for time range, alert type, and region.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex flex-wrap gap-2">
            {filterGroups.ranges.map((item) => (
              <button
                key={item}
                className={`rounded-full px-4 py-2 ${item === "7d" ? "bg-zinc-950 text-white" : "border border-zinc-300 text-zinc-700"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <select className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700 outline-none">
            {filterGroups.types.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700 outline-none">
            {filterGroups.regions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Alert volume trend</h2>
              <p className="mt-1 text-sm text-zinc-500">Mock 7-day activity by detected alerts</p>
            </div>
            <Badge>Last 7 days</Badge>
          </div>

          <div className="mt-8 grid grid-cols-7 items-end gap-4">
            {trendData.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className="flex h-48 items-end">
                  <div
                    className="w-10 rounded-t-2xl bg-zinc-950"
                    style={{ height: `${(item.alerts / maxAlerts) * 100}%` }}
                  />
                </div>
                <div className="text-center text-xs text-zinc-500">
                  <div>{item.label}</div>
                  <div className="mt-1 font-medium text-zinc-700">{item.alerts}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Top monitored themes</h2>
          <p className="mt-1 text-sm text-zinc-500">Most frequent categories in recent competitor activity</p>
          <div className="mt-6 space-y-4">
            {categoryInsights.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">{item.label}</span>
                  <span className="font-medium text-zinc-900">{item.value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white ring-1 ring-zinc-200">
                  <div className="h-2 rounded-full bg-zinc-950" style={{ width: `${item.value * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Latest important alerts</h2>
              <p className="mt-1 text-sm text-zinc-500">Signals worth reacting to first</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-zinc-200 p-5">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
                  <Badge>{alert.type}</Badge>
                  <Badge
                    variant={
                      alert.level === "High" ? "high" : alert.level === "Medium" ? "medium" : "low"
                    }
                  >
                    {alert.level}
                  </Badge>
                  <span className="text-zinc-400">{alert.time}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-zinc-950">{alert.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{alert.competitor}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{alert.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Most active competitors</h2>
          <p className="mt-1 text-sm text-zinc-500">Based on changes detected in the last 7 days</p>
          <div className="mt-6 space-y-4">
            {competitors.map((competitor) => (
              <div key={competitor.id} className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-950">{competitor.name}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{competitor.region}</p>
                  </div>
                  <Badge>{competitor.status}</Badge>
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-600">{competitor.focus}</p>
                <div className="mt-4 flex items-center gap-6 text-sm text-zinc-500">
                  <span>{competitor.monitoredPages} pages</span>
                  <span>{competitor.changes7d} changes / 7d</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
