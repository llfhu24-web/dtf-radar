import Link from "next/link";
import { notFound } from "next/navigation";
import { alerts, competitors } from "@/lib/mock-data";

export default async function CompetitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const competitorId = Number(id);
  const competitor = competitors.find((item) => item.id === competitorId);

  if (!competitor) {
    notFound();
  }

  const relatedAlerts = alerts.filter((alert) => alert.competitorId === competitorId);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link href="/competitors" className="text-sm text-zinc-500 transition hover:text-zinc-900">
        ← Back to competitors
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
              {competitor.region}
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{competitor.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{competitor.description}</p>
            </div>
            <a
              href={competitor.website}
              className="inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4"
            >
              {competitor.website}
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">Monitored pages</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{competitor.monitoredPages}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">Changes (7d)</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{competitor.changes7d}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">Status</p>
              <p className="mt-2 text-xl font-semibold text-zinc-950">{competitor.status}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Tracked categories</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {competitor.trackedCategories.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent alerts</h2>
            <Link href="/alerts" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {relatedAlerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-zinc-200 p-5">
                <p className="text-xs uppercase tracking-wide text-zinc-500">{alert.type}</p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-950">{alert.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{alert.summary}</p>
                <Link
                  href={`/alerts/${alert.id}`}
                  className="mt-4 inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4"
                >
                  Open alert detail
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
