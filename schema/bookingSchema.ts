import { z } from "zod";

export const newBookingSchema = z.object({
  service: z.string(),
  bookingUserInfo: z.object({
    avenue: z.string().min(1).max(60),
    commune: z.string().min(1).max(60),
    ville: z.string().min(1).max(60),
    province: z.string().min(1).max(60),
    telephone: z.string().min(9),
    name: z.string().min(1).max(60),
  }),
  personnelId: z.string().optional(),
  clientId: z.string(),
  debutDate: z.date(),
  // debutTime: z.date(),
  offDay: z.array(z.string()).optional(),
  isStayingAtHome: z.boolean(),
  isDayOff: z.boolean(),
  price: z.number(),
  duration: z.string(),
});
