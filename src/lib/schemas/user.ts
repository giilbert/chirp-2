import { z } from "zod";

export const completeSignUpSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(24)
    .toLowerCase()
    .describe("Username // This will be your tag (3-24 characters)"),
  displayName: z
    .string()
    .min(1)
    .max(50)
    .describe(
      "Display name // This is the name people will see before your tag"
    ),
});
