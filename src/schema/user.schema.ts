import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  googleId: z.string().min(1),
  sid: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
