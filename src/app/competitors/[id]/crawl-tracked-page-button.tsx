"use client";

import { useState } from "react";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";

type CrawlTrackedPageButtonProps = {
  trackedPageId: string;
  locale?: Locale;
};

type CrawlTrackedPageResponse = {
  diff?: {
    eventType?: string;
    changed?: boolean;
    summary?: string[];
  };
  changeEvent?: {
    id: string;
  } | null;
  error?: string;
};

export function CrawlTrackedPageButton({ trackedPageId, locale = "en" }: CrawlTrackedPageButtonProps) {
  const t = getMessages(locale);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRun() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/tracked-pages/${trackedPageId}/crawl`, {
        method: "POST",
      });
      const data = (await response.json()) as CrawlTrackedPageResponse;

      if (!response.ok) {
        throw new Error(data.error || t.competitors.crawlTrackedPageError);
      }

      const summaryText = data.diff?.summary?.join("; ") || t.competitors.noNotableChangeSummary;
      setMessage(
        data.diff?.changed
          ? `${data.diff?.eventType || t.competitors.pageChangeDetected}: ${summaryText}`
          : t.competitors.pageNoChange,
      );
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : t.competitors.crawlUnexpectedError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="inline-flex rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t.competitors.runningPageCrawlButton : t.competitors.runPageCrawlButton}
      </button>

      {message ? <p className="max-w-xl text-xs leading-5 text-emerald-700">{message}</p> : null}
      {error ? <p className="max-w-xl text-xs leading-5 text-red-600">{error}</p> : null}
    </div>
  );
}
