import { z } from "zod";

// export const updateProfileSchema = z.object({
//   name: z.string().trim().min(1, "Должен быть хотя бы один символ").optional(),
//   currentPassword: z.string().min(8, "Должно быть не менее 8 символов").optional(),
//   newPassword: z.string().trim().min(8, "Должно быть не менее 8 символов").optional(),
//   image: z
//     .union([
//       z.instanceof(Blob),
//       z.string().transform((val) => (val === "" ? undefined : val)),
//     ])
//     .optional(),
// });

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Должен быть хотя бы один символ").optional(),
  currentPassword: z.string().min(8, "Должно быть не менее 8 символов").optional(),
  newPassword: z.string().trim().min(8, "Должно быть не менее 8 символов").optional(),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
}).refine(data => {
  if (data.newPassword || data.currentPassword) {
    return !!data.newPassword && !!data.currentPassword;
  }
  return true;
}, {
  message: "При изменении пароля нужно заполнить обя пароля",
  path: ["newPassword"]
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;

export const updateThemeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

export type UpdateThemeSchemaType = z.infer<typeof updateThemeSchema>;
