import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/repositories/dashboard-repository";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

export async function GET() {
  try {
    const summary = await getDashboardSummary(DEFAULT_WORKSPACE_ID);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET /api/dashboard/summary failed", error);
    return NextResponse.json({ error: "Failed to load dashboard summary" }, { status: 500 });
  }
}
