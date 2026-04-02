import Link from "next/link";
import { listCompetitors } from "@/lib/repositories/competitor-repository";
import { getMessages } from "@/lib/i18n/messages";
import { getLocaleFromSearchParams, translateCompetitorStatus, withLocale } from "@/lib/i18n/runtime";

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

export default async function CompetitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromSearchParams(params);
  const t = getMessages(locale);
  const competitors = await getCompetitors();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500">{t.competitors.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{t.competitors.title}</h1>
        </div>
        <Link
          href={withLocale("/competitors/new", locale)}
          className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          {t.competitors.addCompetitor}
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">{t.competitors.competitor}</th>
              <th className="px-6 py-4 font-medium">{t.competitors.region}</th>
              <th className="px-6 py-4 font-medium">{t.competitors.monitoredPages}</th>
              <th className="px-6 py-4 font-medium">{t.competitors.changes7d}</th>
              <th className="px-6 py-4 font-medium">{t.competitors.status}</th>
              <th className="px-6 py-4 font-medium">{t.competitors.notes}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {competitors.length > 0 ? (
              competitors.map((competitor) => (
                <tr key={competitor.id} className="align-top">
                  <td className="px-6 py-5">
                    <Link
                      href={withLocale(`/competitors/${competitor.id}`, locale)}
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
                      {translateCompetitorStatus(competitor.status, locale)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-zinc-600">{competitor.note || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-zinc-500">
                  {t.competitors.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
