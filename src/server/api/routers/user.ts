import { completeSignUpSchema } from "@/lib/schemas/user";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const profileInclude = Prisma.validator<Prisma.ProfileInclude>()({
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
} satisfies Prisma.ProfileInclude);

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
        include: profileInclude,
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

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
});
