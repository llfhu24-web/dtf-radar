export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600">
            DTF competitor intelligence for global sellers
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            Track DTF competitor pricing, product launches, and promotions.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600">
            DTF Radar helps film, ink, powder, and transfer supply sellers monitor
            competitor websites and turn page changes into usable market intel.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#waitlist"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Join waitlist
            </a>
            <a
              href="#features"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              View features
            </a>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <p className="text-sm text-zinc-500">Monitor</p>
            <h2 className="mt-2 text-xl font-semibold">Price changes</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Detect price drops, compare-at price changes, new discounts, and free shipping updates.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6">
            <p className="text-sm text-zinc-500">Discover</p>
            <h2 className="mt-2 text-xl font-semibold">New product launches</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Catch new film sizes, sample packs, powders, inks, and bundles before the market moves.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6">
            <p className="text-sm text-zinc-500">Understand</p>
            <h2 className="mt-2 text-xl font-semibold">Messaging shifts</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Track changes in claims like hot peel, anti-static, wash resistance, and OEM messaging.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">Built for DTF market monitoring</h2>
            <p className="text-zinc-600">
              Not a generic page watcher. DTF Radar is designed to surface the updates that actually matter to film and transfer supply businesses.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <h3 className="text-lg font-semibold">What it tracks</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li>• Product page changes</li>
                <li>• New SKUs and sample packs</li>
                <li>• Price and promo updates</li>
                <li>• CTA and hero copy changes</li>
                <li>• DTF-specific claims and terminology</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <h3 className="text-lg font-semibold">What users get</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li>• Daily competitor change brief</li>
                <li>• Important change alerts</li>
                <li>• AI summaries with business context</li>
                <li>• Historical page snapshots</li>
                <li>• Searchable competitor activity timeline</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">Get early access</h2>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
          We are building DTF Radar for brands, distributors, and independent sellers who need faster competitor intelligence.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-8 text-sm text-zinc-500">
          Waitlist form placeholder — next step: connect a real form or CRM destination.
        </div>
      </section>
    </main>
  );
}
