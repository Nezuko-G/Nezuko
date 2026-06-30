import { z } from "zod";

export const UserDTO = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "user", "guest"]),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const CreateUserDTO = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["admin", "user", "guest"]).default("user"),
});

export const UpdateUserDTO = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const AuthResponseDTO = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserDTO,
});

export type CreateUserInput = z.infer<typeof CreateUserDTO>;
export type UpdateUserInput = z.infer<typeof UpdateUserDTO>;
export type LoginInput = z.infer<typeof LoginDTO>;
export type AuthResponse = z.infer<typeof AuthResponseDTO>;
