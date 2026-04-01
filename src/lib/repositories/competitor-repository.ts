import { prisma } from "@/lib/db/prisma";
import type { CreateCompetitorInput } from "@/lib/validations/competitor";

type CreateCompetitorParams = CreateCompetitorInput & {
  workspaceId: string;
};

export async function listCompetitors(workspaceId: string) {
  return prisma.competitor.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCompetitor(data: CreateCompetitorParams) {
  return prisma.competitor.create({
    data: {
      workspaceId: data.workspaceId,
      name: data.name,
      websiteUrl: data.websiteUrl,
      region: data.region || null,
      note: data.note || null,
    },
  });
}
