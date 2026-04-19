import { z } from "zod";

export const loginSchema = z.object({
  companyEmail: z.string().min(1, { message: "Company email is required" }).email({ message: "Invalid email format" }),
  userEmail: z.string().min(1, { message: "User email is required" }).email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;