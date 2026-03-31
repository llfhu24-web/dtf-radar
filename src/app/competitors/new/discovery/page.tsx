import Link from "next/link";
import { monitoredPages } from "@/lib/mock-data";

export default function DiscoveryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Page discovery</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Review discovered pages before monitoring</h1>
        </div>
        <Link href="/competitors/new" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Back to form
        </Link>
      </div>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Suggested pages</h2>
            <p className="mt-1 text-sm text-zinc-500">
              These are the pages DTF Radar would start tracking for the new competitor.
            </p>
          </div>
          <button className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
            Re-run discovery
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">URL</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Suggested status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {monitoredPages.map((page) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 text-zinc-700">{page.url}</td>
                  <td className="px-6 py-4 text-zinc-600">{page.type}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {page.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800">
            Confirm and start monitoring
          </button>
          <Link
            href="/competitors"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Save and return to competitors
          </Link>
        </div>
      </section>
    </main>
  );
}
