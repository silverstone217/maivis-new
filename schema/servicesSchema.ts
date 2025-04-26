import { z } from "zod";

export const AddServiceSchema = z.object({
  service: z.string().min(1).max(60),
  description: z.string().min(1).max(400),
  price: z.number().min(1).max(10000),
  image: z.string().url(),
});
