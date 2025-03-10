import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
  workspaceId: z.string().trim().min(1, "Required"),
});

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Must be at least 1 character").optional(),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});

export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
