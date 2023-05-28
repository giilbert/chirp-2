import { createChirpSchema } from "@/lib/schemas/chirp";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const chirpRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const chirp = await ctx.prisma.chirp.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            include: {
              user: { select: { image: true } },
            },
          },
        },
      });

      if (!chirp) throw new TRPCError({ code: "NOT_FOUND" });

      return chirp;
    }),
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
        fromUserId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 11;
      const chirps = await ctx.prisma.chirp.findMany({
        where: input.fromUserId
          ? {
              authorId: input.fromUserId,
            }
          : undefined,
        take: TAKE,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            include: {
              user: {
                select: { image: true },
              },
            },
          },
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
