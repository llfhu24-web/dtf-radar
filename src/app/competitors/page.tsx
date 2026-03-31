import Link from "next/link";
import { competitors } from "@/lib/mock-data";

export default function CompetitorsPage() {
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
              <th className="px-6 py-4 font-medium">Focus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {competitors.map((competitor) => (
              <tr key={competitor.id} className="align-top">
                <td className="px-6 py-5">
                  <Link
                    href={`/competitors/${competitor.id}`}
                    className="font-medium text-zinc-950 transition hover:text-zinc-700"
                  >
                    {competitor.name}
                  </Link>
                </td>
                <td className="px-6 py-5 text-zinc-600">{competitor.region}</td>
                <td className="px-6 py-5 text-zinc-600">{competitor.monitoredPages}</td>
                <td className="px-6 py-5 text-zinc-600">{competitor.changes7d}</td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {competitor.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-zinc-600">{competitor.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
