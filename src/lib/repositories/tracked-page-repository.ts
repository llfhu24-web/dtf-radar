import { prisma } from "@/lib/db/prisma";

export async function createTrackedPagesForCompetitor(
  competitorId: string,
  pages: Array<{ url: string; pageType: string; title?: string; discoverySource?: string; priority?: number }>,
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
