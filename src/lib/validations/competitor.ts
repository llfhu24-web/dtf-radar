import { z } from "zod";

export const createCompetitorSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  websiteUrl: z.url("Valid website URL is required"),
  region: z.string().max(24).optional().or(z.literal("")),
  note: z.string().max(1000).optional().or(z.literal("")),
});

export type CreateCompetitorInput = z.infer<typeof createCompetitorSchema>;
