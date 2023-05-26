import { createChirpSchema } from "@/lib/schemas/chirp";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

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

  getInfinite: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 11;
      const chirps = await ctx.prisma.chirp.findMany({
        take: TAKE,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
        },
        cursor: input.cursor
          ? {
              id: input.cursor,
            }
          : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (chirps.length > TAKE) {
        const nextItem = chirps.pop();
        // This will never be null due to the length check
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }

      return {
        chirps,
        nextCursor,
      };
    }),
});
