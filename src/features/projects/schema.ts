import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Обязательное поле"),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
  workspaceId: z.string().trim().min(1, "Обязательное поле"),
});

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Должен быть хотя бы один символ").optional(),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});

export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
