import { prisma } from "@/lib/db/prisma";

export async function getDashboardSummary(workspaceId: string) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [competitorsTracked, changesDetectedToday, highPriorityAlerts, newProductsThisWeek, latestAlerts, activeCompetitors, weeklyEvents] =
    await Promise.all([
      prisma.competitor.count({ where: { workspaceId } }),
      prisma.changeEvent.count({
        where: {
          competitor: { workspaceId },
          detectedAt: { gte: oneDayAgo },
        },
      }),
      prisma.changeEvent.count({
        where: {
          competitor: { workspaceId },
          importanceScore: { gte: 8 },
          detectedAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.changeEvent.count({
        where: {
          competitor: { workspaceId },
          eventType: "New product",
          detectedAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.changeEvent.findMany({
        where: {
          competitor: { workspaceId },
        },
        orderBy: { detectedAt: "desc" },
        take: 4,
        include: {
          competitor: { select: { name: true } },
        },
      }),
      prisma.competitor.findMany({
        where: { workspaceId },
        include: {
          trackedPages: {
            where: { isActive: true },
            select: { id: true },
          },
          changeEvents: {
            where: { detectedAt: { gte: sevenDaysAgo } },
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.changeEvent.findMany({
        where: {
          competitor: { workspaceId },
          detectedAt: { gte: sevenDaysAgo },
        },
        orderBy: { detectedAt: "asc" },
        select: {
          detectedAt: true,
          eventType: true,
        },
      }),
    ]);

  const stats = [
    { label: "Competitors tracked", value: String(competitorsTracked) },
    { label: "Changes detected today", value: String(changesDetectedToday) },
    { label: "High-priority alerts", value: String(highPriorityAlerts) },
    { label: "New products this week", value: String(newProductsThisWeek) },
  ];

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trendsMap = new Map<string, { label: string; alerts: number; price: number; newProducts: number }>();

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = day.toISOString().slice(0, 10);
    trendsMap.set(key, {
      label: dayLabels[day.getDay()],
      alerts: 0,
      price: 0,
      newProducts: 0,
    });
  }

  for (const event of weeklyEvents) {
    const key = event.detectedAt.toISOString().slice(0, 10);
    const bucket = trendsMap.get(key);
    if (!bucket) continue;
    bucket.alerts += 1;
    if (event.eventType === "Price change") bucket.price += 1;
    if (event.eventType === "New product") bucket.newProducts += 1;
  }

  const trends = Array.from(trendsMap.values());

  const themeCounts = new Map<string, number>();
  for (const event of weeklyEvents) {
    const key = event.eventType;
    themeCounts.set(key, (themeCounts.get(key) ?? 0) + 1);
  }

  const themes = Array.from(themeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, value]) => ({ label, value }));

  return {
    stats,
    trends,
    themes,
    latestAlerts,
    activeCompetitors: activeCompetitors.map((competitor) => ({
      id: competitor.id,
      name: competitor.name,
      region: competitor.region,
      status: competitor.status,
      note: competitor.note,
      monitoredPages: competitor.trackedPages.length,
      changes7d: competitor.changeEvents.length,
    })),
  };
}
