import Link from "next/link";

type DiscoveryPageProps = {
  searchParams: Promise<{
    competitorId?: string;
  }>;
};

export default async function DiscoveryPage({ searchParams }: DiscoveryPageProps) {
  const params = await searchParams;
  const competitorId = params.competitorId;

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
        {competitorId ? (
          <div className="mb-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
            Competitor created successfully. Temporary ID: <span className="font-medium">{competitorId}</span>
          </div>
        ) : null}

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
              {[
                ["https://example.com/products/60cm-hot-peel-film", "Product", "Recommended"],
                ["https://example.com/collections/dtf-film", "Category", "Recommended"],
                ["https://example.com/pages/wholesale", "Landing page", "Optional"],
                ["https://example.com/blogs/news", "Blog", "Optional"],
              ].map(([url, type, status]) => (
                <tr key={url}>
                  <td className="px-6 py-4 text-zinc-700">{url}</td>
                  <td className="px-6 py-4 text-zinc-600">{type}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                      {status}
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
