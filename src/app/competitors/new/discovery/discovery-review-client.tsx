"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DiscoveryPageProps = {
  competitorId?: string;
};

const suggestedPages = [
  {
    url: "https://example.com/products/60cm-hot-peel-film",
    pageType: "product",
    status: "Recommended",
  },
  {
    url: "https://example.com/collections/dtf-film",
    pageType: "category",
    status: "Recommended",
  },
  {
    url: "https://example.com/pages/wholesale",
    pageType: "landing",
    status: "Optional",
  },
  {
    url: "https://example.com/blogs/news",
    pageType: "blog",
    status: "Optional",
  },
];

export function DiscoveryReviewClient({ competitorId }: DiscoveryPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    if (!competitorId) {
      setError("Missing competitor id.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/competitors/${competitorId}/tracked-pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pages: suggestedPages.map((page, index) => ({
            url: page.url,
            pageType: page.pageType,
            title: page.url,
            discoverySource: "mock-discovery",
            priority: index,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to confirm tracked pages");
      }

      router.push(`/competitors/${competitorId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
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
            {suggestedPages.map((page) => (
              <tr key={page.url}>
                <td className="px-6 py-4 text-zinc-700">{page.url}</td>
                <td className="px-6 py-4 text-zinc-600">{page.pageType}</td>
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

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleConfirm}
          disabled={loading || !competitorId}
          className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving tracked pages..." : "Confirm and start monitoring"}
        </button>
        <Link
          href="/competitors"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Save and return to competitors
        </Link>
      </div>
    </section>
  );
}
