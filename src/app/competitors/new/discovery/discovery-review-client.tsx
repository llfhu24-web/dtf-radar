"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type DiscoveryPageProps = {
  competitorId?: string;
};

type SuggestedPage = {
  url: string;
  pageType: string;
  title?: string;
  discoverySource?: string;
  priority?: number;
};

export function DiscoveryReviewClient({ competitorId }: DiscoveryPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedPage[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  useEffect(() => {
    async function loadSuggestions() {
      if (!competitorId) return;

      setLoadingSuggestions(true);
      setError("");

      try {
        const response = await fetch(`/api/competitors/${competitorId}/discovery`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load suggestions");
        }

        const items: SuggestedPage[] = data?.items ?? [];
        setSuggestions(items);
        setSelectedUrls(items.map((item) => item.url));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unexpected error");
      } finally {
        setLoadingSuggestions(false);
      }
    }

    void loadSuggestions();
  }, [competitorId]);

  function toggleUrl(url: string) {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url],
    );
  }

  async function handleConfirm() {
    if (!competitorId) {
      setError("Missing competitor id.");
      return;
    }

    const selectedPages = suggestions.filter((page) => selectedUrls.includes(page.url));

    if (selectedPages.length === 0) {
      setError("Select at least one page to monitor.");
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
          pages: selectedPages,
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
            These are derived from the competitor website and can be adjusted before monitoring starts.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Re-run discovery
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">Pick</th>
              <th className="px-6 py-4 font-medium">URL</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {loadingSuggestions ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  Loading discovery suggestions...
                </td>
              </tr>
            ) : suggestions.length > 0 ? (
              suggestions.map((page) => (
                <tr key={page.url}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUrls.includes(page.url)}
                      onChange={() => toggleUrl(page.url)}
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-zinc-700">{page.url}</td>
                  <td className="px-6 py-4 text-zinc-600">{page.pageType}</td>
                  <td className="px-6 py-4 text-zinc-500">{page.discoverySource || "unknown"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No discovery suggestions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleConfirm}
          disabled={loading || !competitorId || loadingSuggestions}
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
