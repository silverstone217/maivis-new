import { z } from "zod";

export const AddpersonnelSchema = z.object({
  name: z.string().max(60),
  job: z.string().max(60),
  avenue: z.string().max(60),
  commune: z.string().max(60),
  ville: z.string().max(60),
  province: z.string().max(60),
  telephone: z.string().max(9),
  email: z.string().email().max(60),
  gender: z.string().max(60),
  birthday: z.date(),
  numero: z.string().max(60).optional(),
  codePostal: z.string().max(60).optional(),
  pays: z.string().max(60).optional(),
});
