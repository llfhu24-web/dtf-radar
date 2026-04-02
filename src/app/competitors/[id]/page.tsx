import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompetitorById } from "@/lib/repositories/competitor-repository";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

type CompetitorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CompetitorDetailPage({ params }: CompetitorDetailPageProps) {
  const { id } = await params;
  const competitor = await getCompetitorById(id, DEFAULT_WORKSPACE_ID);

  if (!competitor) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link href="/competitors" className="text-sm text-zinc-500 transition hover:text-zinc-900">
        ← Back to competitors
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">
              {competitor.region || "Unknown region"}
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{competitor.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                {competitor.note || "No notes yet for this competitor. Add positioning notes, category focus, or market observations later."}
              </p>
            </div>
            <a
              href={competitor.websiteUrl}
              className="inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4"
            >
              {competitor.websiteUrl}
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">Monitored pages</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{competitor.trackedPages.length}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">Recent changes</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{competitor.changeEvents.length}</p>
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
          <h2 className="text-xl font-semibold">Tracked pages</h2>
          <div className="mt-5 space-y-3">
            {competitor.trackedPages.length > 0 ? (
              competitor.trackedPages.map((page) => (
                <div key={page.id} className="rounded-2xl border border-zinc-200 p-4">
                  <p className="text-sm font-medium text-zinc-900">{page.title || page.url}</p>
                  <p className="mt-1 text-xs text-zinc-500">{page.pageType}</p>
                  <p className="mt-2 text-xs text-zinc-400">{page.url}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                No tracked pages yet. The next step is to replace discovery mock results with persisted tracked pages.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent change events</h2>
            <Link href="/alerts" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              View all alerts
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {competitor.changeEvents.length > 0 ? (
              competitor.changeEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">{event.eventType}</p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-950">{event.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{event.summary || "No summary available yet."}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                No real change events yet. Once snapshots and diff detection are wired up, this panel will start showing live competitor changes.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
