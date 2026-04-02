import { NextResponse } from "next/server";
import { listCompetitorsWithTrackedPages } from "@/lib/repositories/competitor-repository";
import { getLatestGlobalCrawlRun } from "@/lib/repositories/global-crawl-run-repository";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

export async function GET() {
  try {
    const [competitors, latestRun] = await Promise.all([
      listCompetitorsWithTrackedPages(DEFAULT_WORKSPACE_ID),
      getLatestGlobalCrawlRun(DEFAULT_WORKSPACE_ID),
    ]);

    const totalPages = competitors.reduce((sum, competitor) => sum + competitor.trackedPages.length, 0);

    return NextResponse.json({
      workspaceId: DEFAULT_WORKSPACE_ID,
      competitors: competitors.length,
      trackedPages: totalPages,
      latestRun: latestRun
        ? {
            id: latestRun.id,
            createdAt: latestRun.createdAt,
            status: latestRun.deliveryStatus,
            summaryMarkdown: latestRun.summaryMarkdown,
            topEventsJson: latestRun.topEventsJson,
          }
        : null,
    });
  } catch (error) {
    console.error("GET /api/crawl/status failed", error);
    return NextResponse.json({ error: "Failed to inspect crawl status" }, { status: 500 });
  }
}
