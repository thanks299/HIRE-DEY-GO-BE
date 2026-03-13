import { z } from "zod";

export const suspendUserSchema = z.object({
  id: z.string()
});