import { NextResponse } from "next/server";
import { listCompetitorsWithTrackedPages } from "@/lib/repositories/competitor-repository";
import { getLatestGlobalCrawlRun } from "@/lib/repositories/global-crawl-run-repository";
import { prisma } from "@/lib/db/prisma";

const DEFAULT_WORKSPACE_ID = "workspace_demo";

export async function GET() {
  try {
    const [competitors, latestRun, recentJobs] = await Promise.all([
      listCompetitorsWithTrackedPages(DEFAULT_WORKSPACE_ID),
      getLatestGlobalCrawlRun(DEFAULT_WORKSPACE_ID),
      prisma.crawlJob.findMany({
        where: {
          trackedPage: {
            competitor: {
              workspaceId: DEFAULT_WORKSPACE_ID,
            },
          },
        },
        orderBy: { startedAt: "desc" },
        take: 20,
        select: {
          id: true,
          status: true,
          startedAt: true,
          finishedAt: true,
          httpStatus: true,
          errorMessage: true,
        },
      }),
    ]);

    const totalPages = competitors.reduce((sum, competitor) => sum + competitor.trackedPages.length, 0);
    const failedJobs = recentJobs.filter((job) => job.status === "failed").length;
    const completedJobs = recentJobs.filter((job) => job.status === "completed").length;
    const runningJobs = recentJobs.filter((job) => job.status === "running").length;

    return NextResponse.json({
      workspaceId: DEFAULT_WORKSPACE_ID,
      competitors: competitors.length,
      trackedPages: totalPages,
      recentJobs: {
        total: recentJobs.length,
        failed: failedJobs,
        completed: completedJobs,
        running: runningJobs,
      },
      latestRun: latestRun
        ? {
            id: latestRun.id,
            createdAt: latestRun.createdAt,
            status: latestRun.deliveryStatus,
            summaryMarkdown: latestRun.summaryMarkdown,
            topEventsJson: latestRun.topEventsJson,
          }
        : null,
    });
  } catch (error) {
    console.error("GET /api/crawl/status failed", error);
    return NextResponse.json({ error: "Failed to inspect crawl status" }, { status: 500 });
  }
}
