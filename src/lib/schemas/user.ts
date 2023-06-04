import { z } from "zod";

export const completeSignUpSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(24)
    .toLowerCase()
    .describe(
      "Username // This will be your tag (3-24 characters). You won't be able to change this!"
    ),
  displayName: z
    .string()
    .min(1)
    .max(50)
    .describe(
      "Display Name // This is the name people will see before your tag"
    ),
});

export const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(1)
    .max(50)
    .describe(
      "Display Name // This is the name people will see before your tag"
    ),
  bio: z.string().max(160).optional().describe("Bio // Tell us about yourself"),
});
