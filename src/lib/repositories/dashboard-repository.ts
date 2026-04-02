import { prisma } from "@/lib/db/prisma";
import { getLatestGlobalCrawlRun } from "@/lib/repositories/global-crawl-run-repository";

export async function getDashboardSummary(workspaceId: string) {
  const [competitors, changeEvents, latestGlobalCrawlRun] = await Promise.all([
    prisma.competitor.findMany({
      where: { workspaceId },
      include: {
        trackedPages: {
          where: { isActive: true },
          select: { id: true },
        },
        changeEvents: {
          where: {
            detectedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          select: { id: true },
        },
      },
    }),
    prisma.changeEvent.findMany({
      where: {
        competitor: {
          workspaceId,
        },
      },
      include: {
        competitor: true,
      },
      orderBy: { detectedAt: "desc" },
    }),
    getLatestGlobalCrawlRun(workspaceId),
  ]);

  const now = new Date();
  const trendDates = [6, 5, 4, 3, 2, 1, 0].map((offset) => {
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    return date;
  });

  const trends = trendDates.map((date) => {
    const alerts = changeEvents.filter((event) => {
      return event.detectedAt.toDateString() === date.toDateString();
    }).length;

    return { label: date.toISOString(), alerts };
  });

  const themeCounts = changeEvents.reduce<Record<string, number>>((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});

  const themes = Object.entries(themeCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const latestAlerts = changeEvents.slice(0, 5);

  const activeCompetitors = competitors
    .map((competitor) => ({
      id: competitor.id,
      name: competitor.name,
      region: competitor.region,
      note: competitor.note,
      status: competitor.status,
      monitoredPages: competitor.trackedPages.length,
      changes7d: competitor.changeEvents.length,
    }))
    .sort((a, b) => b.changes7d - a.changes7d)
    .slice(0, 5);

  const latestGlobalRunStats = (() => {
    if (!latestGlobalCrawlRun || !latestGlobalCrawlRun.topEventsJson || typeof latestGlobalCrawlRun.topEventsJson !== "object") {
      return null;
    }

    const data = latestGlobalCrawlRun.topEventsJson as {
      totalCompetitors?: number;
      totalPages?: number;
      changedCount?: number;
      failedCount?: number;
    };

    return {
      id: latestGlobalCrawlRun.id,
      createdAt: latestGlobalCrawlRun.createdAt,
      status: latestGlobalCrawlRun.deliveryStatus,
      totalCompetitors: data.totalCompetitors ?? 0,
      totalPages: data.totalPages ?? 0,
      changedCount: data.changedCount ?? 0,
      failedCount: data.failedCount ?? 0,
    };
  })();

  return {
    stats: [
      {
        label: "Competitors",
        value: competitors.length,
      },
      {
        label: "Tracked pages",
        value: competitors.reduce((sum, competitor) => sum + competitor.trackedPages.length, 0),
      },
      {
        label: "Alerts in 7d",
        value: changeEvents.filter(
          (event) => event.detectedAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        ).length,
      },
      {
        label: "High priority alerts",
        value: changeEvents.filter((event) => event.importanceScore >= 8).length,
      },
    ],
    trends,
    themes,
    latestAlerts,
    activeCompetitors,
    latestGlobalRunStats,
  };
}
