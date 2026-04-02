import { NextResponse } from "next/server";
import { listAlerts } from "@/lib/repositories/alert-repository";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

export async function GET() {
  try {
    const alerts = await listAlerts(DEFAULT_WORKSPACE_ID);
    const items = alerts.map((alert) => ({
      id: alert.id,
      competitorId: alert.competitor.id,
      competitor: alert.competitor.name,
      title: alert.title,
      type: alert.eventType,
      level: alert.importanceScore >= 8 ? "High" : alert.importanceScore >= 4 ? "Medium" : "Low",
      time: alert.detectedAt,
      summary: alert.summary,
      details: alert.details,
      url: alert.trackedPage.url,
      oldValue: alert.oldValue,
      newValue: alert.newValue,
      tags: Array.isArray(alert.tagsJson) ? alert.tagsJson : [],
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/alerts failed", error);
    return NextResponse.json({ error: "Failed to load alerts" }, { status: 500 });
  }
}
