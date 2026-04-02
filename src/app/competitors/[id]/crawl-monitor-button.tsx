"use client";

import { useState } from "react";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";

type CrawlMonitorButtonProps = {
  competitorId: string;
  locale?: Locale;
};

type CrawlResponse = {
  total: number;
  changedCount: number;
  failedCount: number;
};

export function CrawlMonitorButton({ competitorId, locale = "en" }: CrawlMonitorButtonProps) {
  const t = getMessages(locale);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleRun() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/competitors/${competitorId}/crawl`, {
        method: "POST",
      });

      const data = (await response.json()) as Partial<CrawlResponse> & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || t.competitors.crawlError);
      }

      setMessage(
        t.competitors.crawlSuccess
          .replace("{total}", String(data.total ?? 0))
          .replace("{changes}", String(data.changedCount ?? 0))
          .replace("{failed}", String(data.failedCount ?? 0)),
      );
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : t.competitors.crawlUnexpectedError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="inline-flex rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? t.competitors.crawlingNowButton : t.competitors.crawlNowButton}
      </button>

      {message ? (
        <p className="max-w-xl text-sm text-emerald-700">{message}</p>
      ) : null}

      {error ? <p className="max-w-xl text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
