import { createChirpSchema } from "@/lib/schemas/chirp";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import type { RouterOutputs } from "@/utils/api";

export type EverythingChirp = RouterOutputs["chirp"]["getById"];
export type EverythingChirpWithoutReplying = Omit<
  EverythingChirp,
  "replyingTo"
>;

const createChirpInclude = (userId?: string) =>
  Prisma.validator<Prisma.ChirpInclude>()({
    replyingTo: {
      include: {
        likes: userId
          ? {
              where: { userId },
            }
          : undefined,
        author: {
          include: {
            user: {
              select: { image: true },
            },
          },
        },

        _count: {
          select: {
            quotedBy: true,
            rechirps: true,
            likes: true,
            replies: true,
          },
        },
      },
    },
    author: {
      include: {
        user: {
          select: { image: true },
        },
      },
    },
    likes: userId
      ? {
          where: { userId },
        }
      : undefined,
    _count: {
      select: {
        quotedBy: true,
        rechirps: true,
        likes: true,
        replies: true,
      },
    },
  } satisfies Prisma.ChirpInclude);

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
        include: createChirpInclude(ctx.session?.user.id),
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
          replyingToId: input.replyingToId || undefined,
        },
      });
    }),

  getInfinite: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        replyingToId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 10;
      const chirps = await ctx.prisma.chirp.findMany({
        where: {
          replyingToId: input.replyingToId || null,
        },
        take: TAKE + 1,
        orderBy: {
          createdAt: "desc",
        },
        include: createChirpInclude(ctx.session?.user.id),
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

  getInfiniteFromUser: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        userId: z.string(),
        filter: z.enum(["chirps", "replies", "media", "likes"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 10;
      const chirps = await ctx.prisma.chirp.findMany({
        where: {
          authorId: input.userId,
          replyingToId: input.filter === "replies" ? { not: null } : null,
        },
        take: TAKE + 1,
        orderBy: {
          createdAt: "desc",
        },
        include: createChirpInclude(ctx.session?.user.id),
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

  likeChirp: protectedProcedure
    .input(
      z.object({
        chirpId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chirp.update({
        where: {
          id: input.chirpId,
        },
        data: {
          likes: {
            create: {
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),

  unlikeChirp: protectedProcedure
    .input(
      z.object({
        chirpId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.like.delete({
        where: {
          chirpId_userId: {
            chirpId: input.chirpId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
