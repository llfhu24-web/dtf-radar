import { NextResponse } from "next/server";
import { listCompetitorsWithTrackedPages } from "@/lib/repositories/competitor-repository";
import { saveGlobalCrawlRun } from "@/lib/repositories/global-crawl-run-repository";
import { runTrackedPageCrawl } from "@/lib/services/run-tracked-page-crawl";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

export async function POST() {
  try {
    const competitors = await listCompetitorsWithTrackedPages(DEFAULT_WORKSPACE_ID);
    const items = [] as {
      competitorId: string;
      competitorName: string;
      total: number;
      changedCount: number;
      failedCount: number;
    }[];

    let totalPages = 0;
    let changedCount = 0;
    let failedCount = 0;

    for (const competitor of competitors) {
      if (competitor.trackedPages.length === 0) continue;

      const results = [];

      for (const trackedPage of competitor.trackedPages) {
        results.push(await runTrackedPageCrawl(trackedPage.id, "global-run-all-api"));
      }

      const competitorChangedCount = results.filter((item) => item.changed).length;
      const competitorFailedCount = results.filter((item) => item.error).length;

      totalPages += results.length;
      changedCount += competitorChangedCount;
      failedCount += competitorFailedCount;

      items.push({
        competitorId: competitor.id,
        competitorName: competitor.name,
        total: results.length,
        changedCount: competitorChangedCount,
        failedCount: competitorFailedCount,
      });
    }

    const payload = {
      totalCompetitors: items.length,
      totalPages,
      changedCount,
      failedCount,
      items,
    };

    const savedRun = await saveGlobalCrawlRun({
      workspaceId: DEFAULT_WORKSPACE_ID,
      status: failedCount > 0 ? "completed_with_failures" : "completed",
      totalCompetitors: items.length,
      totalPages,
      changedCount,
      failedCount,
      resultJson: payload,
    });

    return NextResponse.json(
      {
        ...payload,
        runId: savedRun.id,
        runAt: savedRun.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/crawl/run-all failed", error);
    return NextResponse.json({ error: "Failed to run global crawl" }, { status: 500 });
  }
}
