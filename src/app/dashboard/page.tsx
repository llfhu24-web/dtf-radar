import Link from "next/link";
import { alerts, competitors } from "@/lib/mock-data";

const stats = [
  { label: "Competitors tracked", value: "24" },
  { label: "Changes detected today", value: "18" },
  { label: "High-priority alerts", value: "4" },
  { label: "New products this week", value: "11" },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Market overview</h1>
        </div>
        <Link
          href="/alerts"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
        >
          View all alerts
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">{item.value}</p>
          </div>
        ))}
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
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">{alert.type}</span>
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-600">{alert.level}</span>
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
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {competitor.status}
                  </span>
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
