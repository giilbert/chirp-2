import { z } from "zod";

export const createChirpSchema = z.object({
  body: z
    .string()
    .min(1)
    .max(400)
    .describe(" // What do you want to complain about today?"),
  replyingToId: z.string().nullish(),
});
