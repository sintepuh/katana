import { z } from "zod";

export const getThemeSchema = z.object({
  theme: z.string(),
})
