import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Обязательное поле").email(),
  password: z.string().min(1, "Обязательное поле"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Обязательное поле"),
  email: z.string().trim().min(1, "Обязательное поле").email(),
  password: z.string().min(8, "Должно быть не менее 8 символов"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
