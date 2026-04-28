import { z } from "zod";

export const createPostSchema = z.object({
  rating: z.coerce.number().int().min(1).max(10),
  notes: z.string().trim().max(280).optional(),
  ingredients: z.array(z.string().trim().min(1)).min(1),
  steps: z.array(z.string().trim().min(1)).min(1)
});
