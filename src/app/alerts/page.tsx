import Link from "next/link";
import { alerts } from "@/lib/mock-data";

const levelStyles: Record<string, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-zinc-100 text-zinc-700",
};

export default function AlertsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div>
        <p className="text-sm text-zinc-500">Alerts</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Recent market signals</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Review the most recent changes across competitor websites, prioritized by business relevance.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <button className="rounded-full bg-zinc-950 px-4 py-2 text-white">All alerts</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">Price changes</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">New products</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">Promotions</button>
        <button className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-700">Messaging</button>
      </div>

      <div className="mt-8 space-y-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">{alert.type}</span>
                  <span className={`rounded-full px-2.5 py-1 ${levelStyles[alert.level]}`}>
                    {alert.level}
                  </span>
                  <span className="text-zinc-400">{alert.time}</span>
                </div>
                <h2 className="text-xl font-semibold text-zinc-950">{alert.title}</h2>
                <p className="text-sm text-zinc-500">{alert.competitor}</p>
                <p className="max-w-3xl text-sm leading-7 text-zinc-600">{alert.summary}</p>
              </div>
              <Link
                href={`/alerts/${alert.id}`}
                className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                View detail
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
