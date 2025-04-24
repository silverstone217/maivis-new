import { z } from "zod";

export const credAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16),
});

export const registerAuthSchema = z.object({
  name: z.string().max(60).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(16),
  isLogin: z.boolean(),
});
