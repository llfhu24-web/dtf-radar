import { z } from "zod";

export const trackedPageSchema = z.object({
  url: z.url(),
  pageType: z.string().min(1),
  title: z.string().optional(),
  discoverySource: z.string().optional(),
  priority: z.number().int().optional(),
});

export const confirmTrackedPagesSchema = z.object({
  pages: z.array(trackedPageSchema).min(1),
});

export type ConfirmTrackedPagesInput = z.infer<typeof confirmTrackedPagesSchema>;
