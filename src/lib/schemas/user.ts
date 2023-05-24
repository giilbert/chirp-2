import { z } from "zod";

export const completeSignUpSchema = z.object({
  username: z.string().min(3).max(24).describe("Username // 3-24 characters"),
});
