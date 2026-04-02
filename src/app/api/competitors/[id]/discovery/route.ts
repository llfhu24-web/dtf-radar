import { NextResponse } from "next/server";
import { getCompetitorById } from "@/lib/repositories/competitor-repository";
import { buildDiscoverySuggestions } from "@/lib/repositories/tracked-page-repository";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const competitor = await getCompetitorById(id, DEFAULT_WORKSPACE_ID);

    if (!competitor) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
    }

    const items = buildDiscoverySuggestions(competitor.websiteUrl);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/competitors/:id/discovery failed", error);
    return NextResponse.json({ error: "Failed to load discovery suggestions" }, { status: 500 });
  }
}
