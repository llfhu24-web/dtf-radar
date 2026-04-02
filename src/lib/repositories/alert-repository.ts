import { prisma } from "@/lib/db/prisma";

export async function listAlerts(workspaceId: string) {
  return prisma.changeEvent.findMany({
    where: {
      competitor: {
        workspaceId,
      },
    },
    orderBy: [{ detectedAt: "desc" }, { importanceScore: "desc" }],
    include: {
      competitor: true,
      trackedPage: true,
    },
    take: 50,
  });
}

export async function getAlertById(id: string, workspaceId: string) {
  return prisma.changeEvent.findFirst({
    where: {
      id,
      competitor: {
        workspaceId,
      },
    },
    include: {
      competitor: true,
      trackedPage: true,
    },
  });
}

export async function getRecentAlertsForTrackedPage(trackedPageId: string, limit = 5) {
  return prisma.changeEvent.findMany({
    where: {
      trackedPageId,
    },
    orderBy: { detectedAt: "desc" },
    take: limit,
  });
}

export async function getSnapshotsForTrackedPage(trackedPageId: string, limit = 5) {
  return prisma.pageSnapshot.findMany({
    where: {
      trackedPageId,
    },
    orderBy: { fetchedAt: "desc" },
    take: limit,
  });
}
