import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(4, "Must be at least 4 character").optional(),
  currentPassword: z.string().optional(), 
  newPassword: z.string().trim().min(8, "Must be at least 8 character").optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
