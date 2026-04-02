import { prisma } from "@/lib/db/prisma";

export type CreateChangeEventInput = {
  competitorId: string;
  trackedPageId: string;
  snapshotFromId?: string;
  snapshotToId?: string;
  eventType: string;
  title: string;
  summary?: string;
  details?: string;
  importanceScore?: number;
  oldValue?: string;
  newValue?: string;
  tags?: string[];
};

export async function createChangeEvent(input: CreateChangeEventInput) {
  return prisma.changeEvent.create({
    data: {
      competitorId: input.competitorId,
      trackedPageId: input.trackedPageId,
      snapshotFromId: input.snapshotFromId || null,
      snapshotToId: input.snapshotToId || null,
      eventType: input.eventType,
      title: input.title,
      summary: input.summary || null,
      details: input.details || null,
      importanceScore: input.importanceScore ?? 1,
      oldValue: input.oldValue || null,
      newValue: input.newValue || null,
      tagsJson: input.tags ?? [],
    },
  });
}
