import { completeSignUpSchema, editProfileSchema } from "@/lib/schemas/user";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { Prisma, type Profile } from "@prisma/client";
import type { RouterOutputs } from "@/utils/api";

export type EverythingUser = RouterOutputs["user"]["getUserProfileByTag"];

export const createProfileInclude = (userId?: string) =>
  Prisma.validator<Prisma.ProfileInclude>()({
    user: {
      select: {
        image: true,
      },
    },
    _count: {
      select: {
        chirps: true,
        followers: true,
        following: true,
      },
    },
    followers: {
      where: { userId },
    },
  } satisfies Prisma.ProfileInclude);

export const fixFollowers = (profile: { followers: Profile[] }) => {
  if (!profile.followers) {
    profile.followers = [];
  }
};

export const userRouter = createTRPCRouter({
  getUserProfileByTag: publicProcedure
    .input(
      z.object({
        tag: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const profile = await ctx.prisma.profile.findUnique({
        where: { username: input.tag },
        include: createProfileInclude(ctx.session?.user.id),
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      fixFollowers(profile);

      return profile;
    }),

  completeSignUp: publicProcedure
    .input(completeSignUpSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });

      const alreadyProfile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (alreadyProfile)
        throw new TRPCError({
          code: "CONFLICT",
          message: "You've already signed up.",
        });

      // check that the username is not taken
      const alreadyUsername = await ctx.prisma.profile.findUnique({
        where: { username: input.username },
      });

      if (alreadyUsername)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username is already taken.",
        });

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          profile: {
            create: {
              username: input.username,
              displayName: input.displayName,
            },
          },
        },
      });
    }),

  followUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.session.user.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't follow yourself.",
        });

      await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          following: {
            connect: {
              userId: input.userId,
            },
          },
        },
      });
    }),

  unfollowUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          following: {
            disconnect: {
              userId: input.userId,
            },
          },
        },
      });
    }),

  editProfile: protectedProcedure
    .input(editProfileSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.profile.update({
        where: { userId: ctx.session.user.id },
        data: {
          displayName: input.displayName,
          bio: input.bio,
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

      const profiles = await ctx.prisma.profile.findMany({
        where: {
          displayName: { search: input.query },
          username: { search: input.query },
          bio: { search: input.query },
        },
        take: TAKE + 1,
        orderBy: {
          _relevance: {
            sort: "desc",
            fields: ["displayName", "username", "bio"],
            search: input.query,
          },
        },
        include: createProfileInclude(ctx.session?.user.id),
        cursor: input.cursor ? { userId: input.cursor } : undefined,
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (profiles.length > TAKE) {
        const nextItem = profiles.pop();
        // This will never be null due to the length check
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.userId;
      }

      for (const profile of profiles) {
        fixFollowers(profile);
      }

      return {
        profiles,
        nextCursor,
      };
    }),
});
