import { prisma } from "@/lib/db/prisma";

export type CreateCrawlJobInput = {
  trackedPageId: string;
  fetchMode?: string;
};

export type CompleteCrawlJobInput = {
  crawlJobId: string;
  status: string;
  httpStatus?: number;
  errorMessage?: string;
};

export async function createCrawlJob(input: CreateCrawlJobInput) {
  return prisma.crawlJob.create({
    data: {
      trackedPageId: input.trackedPageId,
      fetchMode: input.fetchMode || "manual",
      status: "running",
      startedAt: new Date(),
    },
  });
}

export async function completeCrawlJob(input: CompleteCrawlJobInput) {
  return prisma.crawlJob.update({
    where: { id: input.crawlJobId },
    data: {
      status: input.status,
      httpStatus: input.httpStatus ?? null,
      errorMessage: input.errorMessage ?? null,
      finishedAt: new Date(),
    },
  });
}
