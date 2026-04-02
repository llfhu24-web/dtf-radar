import { prisma } from "@/lib/db/prisma";

export type TrackedPageInput = {
  url: string;
  pageType: string;
  title?: string;
  discoverySource?: string;
  priority?: number;
};

function buildSuggestedPaths() {
  return [
    { path: "/products", pageType: "product", title: "Products" },
    { path: "/collections", pageType: "category", title: "Collections" },
    { path: "/pages/wholesale", pageType: "landing", title: "Wholesale" },
    { path: "/blogs/news", pageType: "blog", title: "News" },
  ];
}

export function buildDiscoverySuggestions(websiteUrl: string): TrackedPageInput[] {
  let normalizedOrigin = websiteUrl;

  try {
    normalizedOrigin = new URL(websiteUrl).origin;
  } catch {
    normalizedOrigin = websiteUrl.replace(/\/$/, "");
  }

  return buildSuggestedPaths().map((item, index) => ({
    url: `${normalizedOrigin}${item.path}`,
    pageType: item.pageType,
    title: item.title,
    discoverySource: "derived-from-website",
    priority: index,
  }));
}

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
