import { z } from "zod";

import { TaskStatus } from "./types";

export const getTasksSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TaskStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
})

export const createTaskSchema = z.object({
  name: z.string().min(1),
  status: z.nativeEnum(TaskStatus, { required_error: "Status is required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  description: z.string().optional(),
});

export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;


