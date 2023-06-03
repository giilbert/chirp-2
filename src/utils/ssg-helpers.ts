import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import * as superjson from "superjson";

export const createSsgHelpers = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });
