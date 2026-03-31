import Link from "next/link";

export default function NewCompetitorPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Add competitor</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Create a new monitored competitor</h1>
        </div>
        <Link href="/competitors" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Back to competitors
        </Link>
      </div>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6">
          <div>
            <label className="text-sm font-medium text-zinc-700">Competitor website URL</label>
            <input
              className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
              placeholder="https://example.com"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">Competitor name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                placeholder="PrintPro Supply"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Region</label>
              <input
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                placeholder="US"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Notes</label>
            <textarea
              className="mt-2 min-h-32 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
              placeholder="Focus on hot peel film, sample packs, pricing, and wholesale pages."
            />
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold">Suggested next step</h2>
            <p className="text-sm leading-7 text-zinc-600">
              After saving the competitor, DTF Radar should discover product pages,
              category pages, promotions, and blog/news pages for review before monitoring starts.
            </p>
            <div>
              <Link
                href="/competitors/new/discovery"
                className="inline-flex rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Continue to page discovery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
