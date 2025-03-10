import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Required").email(),
  password: z.string().min(1, "Required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().trim().min(1, "Required").email(),
  password: z.string().min(8, "Minimum 8 characters"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
