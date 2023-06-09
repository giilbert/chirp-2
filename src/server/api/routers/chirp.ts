import { createChirpSchema } from "@/lib/schemas/chirp";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import type { RouterOutputs } from "@/utils/api";
import { createProfileInclude, fixFollowers } from "./user";

export type EverythingChirp = RouterOutputs["chirp"]["getById"];
export type EverythingChirpWithoutNesting = Omit<
  EverythingChirp,
  "replyingTo" | "rechirpedFrom" | "replyingToId" | "rechirpedFromId"
>;

const fixChirpLikes = (
  chirp: EverythingChirp | EverythingChirpWithoutNesting
) => {
  if (!chirp.likes) {
    chirp.likes = [];
  }
  if ("rechirpedFrom" in chirp && chirp.rechirpedFrom) {
    fixChirpLikes(chirp.rechirpedFrom);
  }
  if ("replyingTo" in chirp && chirp.replyingTo) {
    fixChirpLikes(chirp.replyingTo);
  }
};

const createChirpIncludeWithoutReplyingTo = (userId?: string) =>
  Prisma.validator<Prisma.ChirpInclude>()({
    media: true,
    likes: userId
      ? {
          where: { userId },
        }
      : undefined,
    author: {
      include: createProfileInclude(userId),
    },
    _count: {
      select: {
        rechirps: true,
        likes: true,
        replies: true,
      },
    },
  } satisfies Prisma.ChirpInclude);

const createChirpInclude = (userId?: string) =>
  Prisma.validator<Prisma.ChirpInclude>()({
    rechirpedFrom: { include: createChirpIncludeWithoutReplyingTo(userId) },
    replyingTo: { include: createChirpIncludeWithoutReplyingTo(userId) },
    media: true,
    author: {
      include: createProfileInclude(userId),
    },
    likes: userId
      ? {
          where: { userId },
        }
      : undefined,
    _count: {
      select: {
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

      fixChirpLikes(chirp);
      fixFollowers(chirp.author);

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

      for (const chirp of chirps) {
        fixChirpLikes(chirp);
        fixFollowers(chirp.author);
      }

      return {
        chirps,
        nextCursor,
      };
    }),

  getInfiniteFollowing: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 10;
      const chirps = await ctx.prisma.chirp.findMany({
        where: {
          author: {
            followers: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
        take: TAKE + 1,
        orderBy: {
          createdAt: "desc",
        },
        include: createChirpInclude(ctx.session.user.id),
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (chirps.length > TAKE) {
        const nextItem = chirps.pop();
        // This will never be null due to the length check
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }

      for (const chirp of chirps) {
        fixChirpLikes(chirp);
        fixFollowers(chirp.author);
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
          authorId: input.filter !== "likes" ? input.userId : undefined,
          replyingToId: input.filter === "replies" ? { not: null } : null,
          media:
            input.filter === "media"
              ? {
                  some: {
                    mediaType: {
                      in: ["IMAGE", "VIDEO", "AUDIO"],
                    },
                  },
                }
              : undefined,
          likes:
            input.filter === "likes"
              ? {
                  some: {
                    userId: input.userId,
                  },
                }
              : undefined,
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

      for (const chirp of chirps) {
        fixChirpLikes(chirp);
        fixFollowers(chirp.author);
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

  rechirp: protectedProcedure
    .input(
      z.object({
        chirpId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chirp.create({
        data: {
          body: "",
          authorId: ctx.session.user.id,
          rechirpedFromId: input.chirpId,
        },
      });
    }),

  searchInfinite: publicProcedure
    .input(
      z.object({
        query: z.string(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const TAKE = 10;

      const chirps = await ctx.prisma.chirp.findMany({
        where: {
          body: {
            search: input.query,
          },
        },
        take: TAKE + 1,
        orderBy: {
          createdAt: "desc",
        },
        include: createChirpInclude(ctx.session?.user.id),
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (chirps.length > TAKE) {
        const nextItem = chirps.pop();
        // This will never be null due to the length check
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }

      for (const chirp of chirps) {
        fixChirpLikes(chirp);
        fixFollowers(chirp.author);
      }

      return {
        chirps,
        nextCursor,
      };
    }),
});
