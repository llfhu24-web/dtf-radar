import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";
import { getLocaleFromSearchParams, withLocale } from "@/lib/i18n/runtime";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromSearchParams(params);
  const t = getMessages(locale);

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600">
              {t.home.badge}
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
                {t.home.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600">{t.home.subtitle}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={withLocale("/dashboard", locale)}
                className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                {t.home.primaryCta}
              </Link>
              <Link
                href={withLocale("/competitors", locale)}
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                {t.home.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">{t.home.highlights}</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
                <p className="text-xs font-medium uppercase tracking-wide text-red-500">{t.home.highPriority}</p>
                <h3 className="mt-2 text-lg font-semibold">{t.home.priceDropTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{t.home.priceDropDesc}</p>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">{t.home.newProduct}</p>
                <h3 className="mt-2 text-lg font-semibold">{t.home.samplePackTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{t.home.samplePackDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">{t.home.featuresTitle}</h2>
            <p className="text-zinc-600">{t.home.featuresSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.home.featureCards.map((item) => (
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
            <h2 className="text-3xl font-semibold tracking-tight">{t.home.howItWorks}</h2>
            <div className="mt-8 space-y-5">
              {t.home.steps.map((step, index) => (
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
            <h2 className="text-2xl font-semibold tracking-tight">{t.home.idealFor}</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-600">
              {t.home.idealForItems.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-500">
              {t.home.nextStep}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
