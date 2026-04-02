import { NextResponse } from "next/server";
import { getCompetitorById } from "@/lib/repositories/competitor-repository";
import { replaceTrackedPagesForCompetitor } from "@/lib/repositories/tracked-page-repository";
import { confirmTrackedPagesSchema } from "@/lib/validations/tracked-page";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const competitor = await getCompetitorById(id, DEFAULT_WORKSPACE_ID);

    if (!competitor) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
    }

    const json = await request.json();
    const parsed = confirmTrackedPagesSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const trackedPages = await replaceTrackedPagesForCompetitor(id, parsed.data.pages);

    return NextResponse.json({ items: trackedPages }, { status: 201 });
  } catch (error) {
    console.error("POST /api/competitors/:id/tracked-pages failed", error);
    return NextResponse.json({ error: "Failed to confirm tracked pages" }, { status: 500 });
  }
}
