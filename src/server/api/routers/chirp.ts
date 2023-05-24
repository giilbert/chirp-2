import { createChirpSchema } from "@/lib/schemas/chirp";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chirpRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createChirpSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chirp.create({
        data: {
          body: input.body,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
