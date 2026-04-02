import { NextResponse } from "next/server";
import { runTrackedPageCrawl } from "@/lib/services/run-tracked-page-crawl";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await runTrackedPageCrawl(id, "manual-api");

    return NextResponse.json(
      {
        trackedPageId: result.trackedPageId,
        crawlJobId: result.crawlJobId,
        snapshotId: result.snapshotId,
        changeEventId: result.changeEventId,
        changed: result.changed,
        eventType: result.eventType,
        error: result.error,
      },
      { status: result.error ? 500 : 201 },
    );
  } catch (error) {
    console.error("POST /api/tracked-pages/:id/crawl failed", error);
    return NextResponse.json({ error: "Failed to crawl tracked page" }, { status: 500 });
  }
}
