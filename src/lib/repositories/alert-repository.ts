import { prisma } from "@/lib/db/prisma";

export async function listAlerts(workspaceId: string) {
  return prisma.changeEvent.findMany({
    where: {
      competitor: {
        workspaceId,
      },
    },
    orderBy: {
      detectedAt: "desc",
    },
    include: {
      competitor: {
        select: {
          id: true,
          name: true,
        },
      },
      trackedPage: {
        select: {
          id: true,
          url: true,
          title: true,
          pageType: true,
        },
      },
    },
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
      competitor: {
        select: {
          id: true,
          name: true,
        },
      },
      trackedPage: {
        select: {
          id: true,
          url: true,
          title: true,
          pageType: true,
        },
      },
    },
  });
}
