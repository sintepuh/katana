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
  name: z.string({
    required_error: "Должен быть хотя бы один символ",
    invalid_type_error: "Некорректное название"
  }).min(1, { message: "Должен быть хотя бы один символ" }),
  
  status: z.nativeEnum(TaskStatus, {
    required_error: "Статус обязателен",
    invalid_type_error: "Некорректный статус"
  }),
  
  workspaceId: z.string({
    required_error: "Обязательное поле",
    invalid_type_error: "Должно быть строкой"
  }).trim().min(1, { message: "Обязательное поле" }),
  
  projectId: z.string({
    required_error: "Обязательное поле",
    invalid_type_error: "Должно быть строкой"
  }).trim().min(1, { message: "Обязательное поле" }),
  
  assigneeId: z.string({
    required_error: "Обязательное поле",
    invalid_type_error: "Должно быть строкой"
  }).trim().min(1, { message: "Обязательное поле" }),
  
  dueDate: z.coerce.date({
    required_error: "Дата обязательна",
    invalid_type_error: "Некорректная дата"
  }),
  
  description: z.string().optional()
});
export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;


