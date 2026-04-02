import { z } from "zod";

export const createChangeEventSchema = z.object({
  competitorId: z.string().min(1),
  trackedPageId: z.string().min(1),
  eventType: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  details: z.string().optional(),
  importanceScore: z.number().int().min(1).max(10).optional(),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateChangeEventInput = z.infer<typeof createChangeEventSchema>;
