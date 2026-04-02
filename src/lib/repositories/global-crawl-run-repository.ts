import { prisma } from "@/lib/db/prisma";

export type SaveGlobalCrawlRunInput = {
  workspaceId: string;
  status: string;
  totalCompetitors: number;
  totalPages: number;
  changedCount: number;
  failedCount: number;
  resultJson?: unknown;
};

export async function saveGlobalCrawlRun(input: SaveGlobalCrawlRunInput) {
  return prisma.dailyBrief.create({
    data: {
      workspaceId: input.workspaceId,
      date: new Date(),
      summaryMarkdown: `Global crawl status: ${input.status}`,
      deliveryStatus: input.status,
      topEventsJson: {
        totalCompetitors: input.totalCompetitors,
        totalPages: input.totalPages,
        changedCount: input.changedCount,
        failedCount: input.failedCount,
        result: input.resultJson ?? null,
      },
    },
  });
}

export async function getLatestGlobalCrawlRun(workspaceId: string) {
  const rows = await prisma.dailyBrief.findMany({
    where: {
      workspaceId,
      summaryMarkdown: {
        startsWith: "Global crawl status:",
      },
    },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return rows[0] ?? null;
}
