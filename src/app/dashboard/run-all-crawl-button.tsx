"use client";

import { useState } from "react";
import { getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";

type RunAllCrawlButtonResponse = {
  totalCompetitors?: number;
  totalPages?: number;
  changedCount?: number;
  failedCount?: number;
  error?: string;
};

export function RunAllCrawlButton({ locale = "en" }: { locale?: Locale }) {
  const t = getMessages(locale);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRun() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/crawl/run-all", {
        method: "POST",
      });
      const data = (await response.json()) as RunAllCrawlButtonResponse;

      if (!response.ok) {
        throw new Error(data.error || t.dashboard.globalRunError);
      }

      setMessage(
        t.dashboard.globalRunSuccess
          .replace("{competitors}", String(data.totalCompetitors ?? 0))
          .replace("{pages}", String(data.totalPages ?? 0))
          .replace("{changes}", String(data.changedCount ?? 0))
          .replace("{failed}", String(data.failedCount ?? 0)),
      );
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : t.dashboard.globalRunUnexpectedError);
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
        {loading ? t.dashboard.runningAllButton : t.dashboard.runAllButton}
      </button>

      {message ? <p className="max-w-2xl text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="max-w-2xl text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
