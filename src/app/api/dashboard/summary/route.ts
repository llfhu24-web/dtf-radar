import { NextResponse } from "next/server";
import { alerts, categoryInsights, dashboardStats, trendData } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    stats: dashboardStats,
    trends: trendData,
    themes: categoryInsights,
    latestAlerts: alerts.slice(0, 4),
  });
}
