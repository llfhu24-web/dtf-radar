"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormState = {
  name: string;
  websiteUrl: string;
  region: string;
  note: string;
};

export default function NewCompetitorPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    websiteUrl: "",
    region: "",
    note: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/competitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        const issueMessage = data?.issues?.fieldErrors
          ? Object.values(data.issues.fieldErrors).flat().filter(Boolean).join(" ")
          : data?.error;
        throw new Error(issueMessage || "Failed to create competitor");
      }

      router.push(`/competitors/new/discovery?competitorId=${data.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

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
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-zinc-700">Competitor website URL</label>
            <input
              value={form.websiteUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, websiteUrl: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
              placeholder="https://example.com"
              name="websiteUrl"
              required
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">Competitor name</label>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                placeholder="PrintPro Supply"
                name="name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Region</label>
              <input
                value={form.region}
                onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
                placeholder="US"
                name="region"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Notes</label>
            <textarea
              value={form.note}
              onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
              className="mt-2 min-h-32 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-zinc-500"
              placeholder="Focus on hot peel film, sample packs, pricing, and wholesale pages."
              name="note"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
            <h2 className="text-lg font-semibold">Suggested next step</h2>
            <p className="text-sm leading-7 text-zinc-600">
              After saving the competitor, DTF Radar should discover product pages,
              category pages, promotions, and blog/news pages for review before monitoring starts.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving competitor..." : "Save and continue"}
              </button>
              <Link
                href="/competitors/new/discovery"
                className="inline-flex rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                View mock discovery screen
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
