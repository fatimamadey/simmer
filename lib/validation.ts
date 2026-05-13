import { z } from "zod";

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const ingredientSchema = z.string().trim().min(1, "Add an ingredient.").max(180, "Keep ingredients under 180 characters.");
const stepSchema = z.string().trim().min(1, "Add a step.").max(500, "Keep steps under 500 characters.");

export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Add a title.").max(120),
  rating: z.coerce.number().int().min(1).max(10),
  notes: z.string().trim().max(280).optional(),
  ingredients: z.array(ingredientSchema).min(1, "Add at least one ingredient.").max(30, "Keep recipes to 30 ingredients or fewer."),
  steps: z.array(stepSchema).min(1, "Add at least one step.").max(25, "Keep recipes to 25 steps or fewer.")
});
