import { prisma } from "@/lib/db/prisma";

export type TrackedPageInput = {
  url: string;
  pageType: string;
  title?: string;
  discoverySource?: string;
  priority?: number;
};

export async function createTrackedPagesForCompetitor(
  competitorId: string,
  pages: TrackedPageInput[],
) {
  if (pages.length === 0) return [];

  await prisma.trackedPage.createMany({
    data: pages.map((page) => ({
      competitorId,
      url: page.url,
      pageType: page.pageType,
      title: page.title || null,
      discoverySource: page.discoverySource || "manual",
      priority: page.priority ?? 0,
      isActive: true,
    })),
    skipDuplicates: false,
  });

  return prisma.trackedPage.findMany({
    where: { competitorId },
    orderBy: { createdAt: "desc" },
  });
}

export async function replaceTrackedPagesForCompetitor(
  competitorId: string,
  pages: TrackedPageInput[],
) {
  await prisma.trackedPage.deleteMany({
    where: { competitorId },
  });

  return createTrackedPagesForCompetitor(competitorId, pages);
}
