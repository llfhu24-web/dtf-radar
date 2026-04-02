import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type CreatePageSnapshotInput = {
  trackedPageId: string;
  title?: string | null;
  metaDescription?: string | null;
  h1?: string | null;
  mainText?: string | null;
  rawHtmlHash?: string | null;
  price?: string | null;
  comparePrice?: string | null;
  currency?: string | null;
  ctaText?: string | null;
  payloadJson?: unknown;
};

export async function getTrackedPageById(trackedPageId: string) {
  return prisma.trackedPage.findUnique({
    where: { id: trackedPageId },
    include: {
      competitor: true,
      snapshots: {
        orderBy: { fetchedAt: "desc" },
        take: 2,
      },
    },
  });
}

export async function createPageSnapshot(input: CreatePageSnapshotInput) {
  return prisma.pageSnapshot.create({
    data: {
      trackedPageId: input.trackedPageId,
      title: input.title ?? null,
      metaDescription: input.metaDescription ?? null,
      h1: input.h1 ?? null,
      mainText: input.mainText ?? null,
      rawHtmlHash: input.rawHtmlHash ?? null,
      price: input.price ?? null,
      comparePrice: input.comparePrice ?? null,
      currency: input.currency ?? null,
      ctaText: input.ctaText ?? null,
      payloadJson:
        input.payloadJson === undefined
          ? undefined
          : input.payloadJson === null
            ? Prisma.JsonNull
            : (input.payloadJson as Prisma.InputJsonValue),
    },
  });
}
