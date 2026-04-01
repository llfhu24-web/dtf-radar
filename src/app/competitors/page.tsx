import Link from "next/link";
import { listCompetitors } from "@/lib/repositories/competitor-repository";

type CompetitorListItem = {
  id: string;
  name: string;
  websiteUrl: string;
  region: string | null;
  status: string;
  note: string | null;
  monitoredPages: number;
  changes7d: number;
};

const DEFAULT_WORKSPACE_ID = "workspace_demo";

async function getCompetitors(): Promise<CompetitorListItem[]> {
  try {
    const competitors = await listCompetitors(DEFAULT_WORKSPACE_ID);
    return competitors.map((competitor) => ({
      id: competitor.id,
      name: competitor.name,
      websiteUrl: competitor.websiteUrl,
      region: competitor.region,
      status: competitor.status,
      note: competitor.note,
      monitoredPages: competitor.trackedPages.length,
      changes7d: competitor.changeEvents.length,
    }));
  } catch {
    return [];
  }
}

export default async function CompetitorsPage() {
  const competitors = await getCompetitors();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">Competitors</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Tracked competitor websites</h1>
        </div>
        <Link
          href="/competitors/new"
          className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Add competitor
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Competitor</th>
              <th className="px-6 py-4 font-medium">Region</th>
              <th className="px-6 py-4 font-medium">Monitored pages</th>
              <th className="px-6 py-4 font-medium">Changes (7d)</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {competitors.length > 0 ? (
              competitors.map((competitor) => (
                <tr key={competitor.id} className="align-top">
                  <td className="px-6 py-5">
                    <Link
                      href={`/competitors/${competitor.id}`}
                      className="font-medium text-zinc-950 transition hover:text-zinc-700"
                    >
                      {competitor.name}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-400">{competitor.websiteUrl}</p>
                  </td>
                  <td className="px-6 py-5 text-zinc-600">{competitor.region || "—"}</td>
                  <td className="px-6 py-5 text-zinc-600">{competitor.monitoredPages}</td>
                  <td className="px-6 py-5 text-zinc-600">{competitor.changes7d}</td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {competitor.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-zinc-600">{competitor.note || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-zinc-500">
                  No competitors yet. Create your first one to start building a real monitored list.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
