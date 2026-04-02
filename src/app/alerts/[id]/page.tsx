import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlertById } from "@/lib/repositories/alert-repository";

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

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function AlertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const alert = await getAlertById(id, DEFAULT_WORKSPACE_ID);

  if (!alert) {
    notFound();
  }

  const level = getLevel(alert.importanceScore);
  const tags = Array.isArray(alert.tagsJson) ? alert.tagsJson : [];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Link href="/alerts" className="text-sm text-zinc-500 transition hover:text-zinc-900">
        ← Back to alerts
      </Link>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">{alert.eventType}</span>
          <span className={`rounded-full px-2.5 py-1 ${levelStyles[level]}`}>{level}</span>
          <span className="text-zinc-400">{formatTime(alert.detectedAt)}</span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950">{alert.title}</h1>
        <p className="mt-3 text-sm text-zinc-500">{alert.competitor.name}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {alert.oldValue ? (
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">Old value</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">{alert.oldValue}</p>
            </div>
          ) : null}
          {alert.newValue ? (
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <p className="text-sm text-zinc-500">New value</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">{alert.newValue}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{alert.summary || "No summary available yet."}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Why it matters</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{alert.details || "No detail explanation available yet."}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span key={String(tag)} className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700">
                    {String(tag)}
                  </span>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No tags yet.</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Tracked page</h2>
            <a
              href={alert.trackedPage.url}
              className="mt-3 inline-flex text-sm font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4"
            >
              {alert.trackedPage.title || alert.trackedPage.url}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
