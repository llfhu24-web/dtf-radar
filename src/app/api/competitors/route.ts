import { NextResponse } from "next/server";
import { createCompetitor, listCompetitors } from "@/lib/repositories/competitor-repository";
import { createCompetitorSchema } from "@/lib/validations/competitor";

// MVP placeholder workspace id until auth/workspace selection is implemented.
const DEFAULT_WORKSPACE_ID = "workspace_demo";

export async function GET() {
  try {
    const competitors = await listCompetitors(DEFAULT_WORKSPACE_ID);
    const items = competitors.map((competitor) => ({
      id: competitor.id,
      name: competitor.name,
      websiteUrl: competitor.websiteUrl,
      region: competitor.region,
      status: competitor.status,
      note: competitor.note,
      monitoredPages: competitor.trackedPages.length,
      changes7d: competitor.changeEvents.length,
      createdAt: competitor.createdAt,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/competitors failed", error);
    return NextResponse.json({ error: "Failed to load competitors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = createCompetitorSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const competitor = await createCompetitor({
      workspaceId: DEFAULT_WORKSPACE_ID,
      ...parsed.data,
    });

    return NextResponse.json(competitor, { status: 201 });
  } catch (error) {
    console.error("POST /api/competitors failed", error);
    return NextResponse.json({ error: "Failed to create competitor" }, { status: 500 });
  }
}
