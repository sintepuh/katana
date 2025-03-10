import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});

export type CreateWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be at least 1 character").optional(),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});

export type UpdateWorkspaceSchemaType = z.infer<typeof updateWorkspaceSchema>;
