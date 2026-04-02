import { NextResponse } from "next/server";
import { getCompetitorWithTrackedPages, listCompetitorsWithTrackedPages } from "@/lib/repositories/competitor-repository";
import { runTrackedPageCrawl } from "@/lib/services/run-tracked-page-crawl";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const competitor = await getCompetitorWithTrackedPages(id, DEFAULT_WORKSPACE_ID);

    if (!competitor) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
    }

    if (competitor.trackedPages.length === 0) {
      return NextResponse.json(
        { error: "Competitor has no active tracked pages" },
        { status: 400 },
      );
    }

    const results = [];

    for (const trackedPage of competitor.trackedPages) {
      results.push(await runTrackedPageCrawl(trackedPage.id, "competitor-batch-api"));
    }

    return NextResponse.json(
      {
        competitorId: competitor.id,
        competitorName: competitor.name,
        total: results.length,
        changedCount: results.filter((item) => item.changed).length,
        failedCount: results.filter((item) => item.error).length,
        items: results,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/competitors/:id/crawl failed", error);
    return NextResponse.json({ error: "Failed to crawl competitor tracked pages" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const competitors = await listCompetitorsWithTrackedPages(DEFAULT_WORKSPACE_ID);

    const items = competitors.map((competitor) => ({
      competitorId: competitor.id,
      competitorName: competitor.name,
      trackedPages: competitor.trackedPages.length,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/competitors/:id/crawl failed", error);
    return NextResponse.json({ error: "Failed to inspect crawl target competitor" }, { status: 500 });
  }
}
