import Link from "next/link";

const featureCards = [
  {
    title: "Price change detection",
    desc: "Track product price drops, compare-at pricing, and shipping threshold changes on competitor websites.",
  },
  {
    title: "New product launch discovery",
    desc: "Catch new DTF film sizes, powders, inks, bundles, and sample packs as soon as they appear.",
  },
  {
    title: "Messaging and claim monitoring",
    desc: "Detect changes in selling points like hot peel, anti-static, wash resistance, and OEM/wholesale positioning.",
  },
];

const steps = [
  "Add competitor websites and choose which pages to monitor.",
  "We scan public pages, store snapshots, and detect meaningful changes.",
  "Daily briefs summarize what changed and why it may matter to your business.",
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600">
              Competitor intelligence for the DTF market
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
                Monitor DTF competitors without manually checking websites every day.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                DTF Radar helps suppliers, brands, and distributors track pricing,
                promotions, product launches, and messaging changes across public
                competitor sites.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                View dashboard
              </Link>
              <Link
                href="/competitors"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Explore competitors view
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Today’s highlights</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
                <p className="text-xs font-medium uppercase tracking-wide text-red-500">High priority</p>
                <h3 className="mt-2 text-lg font-semibold">Price drop detected</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  PrintPro Supply reduced a core 60cm hot peel film SKU from $89 to $79.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">New product</p>
                <h3 className="mt-2 text-lg font-semibold">Sample pack launched</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  ColorFilm Direct added a beginner-oriented sample pack page to reduce trial friction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">Built around real DTF signals</h2>
            <p className="text-zinc-600">
              Instead of generic page alerts, DTF Radar focuses on the changes that sellers actually care about.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featureCards.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <div className="mt-8 space-y-5">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-zinc-200 p-5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-zinc-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight">Ideal for</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-600">
              <li>• DTF film and consumables sellers</li>
              <li>• Shopify or WooCommerce operators in printing supplies</li>
              <li>• Distributors comparing wholesale competitors</li>
              <li>• Marketing teams tracking market messaging changes</li>
            </ul>
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500">
              Next step: connect a waitlist form, demo request flow, or CRM integration.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
