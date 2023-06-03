import { ChirpBigView } from "@/components/chirp/big-view";
import { ChirpsList } from "@/components/chirp/list";
import { Layout } from "@/components/layout";
import { OnBottom } from "@/components/ui/on-bottom";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { createSsgHelpers } from "@/utils/ssg-helpers";
import { TRPCError } from "@trpc/server";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

const ChirpPage: React.FC = () => {
  const router = useRouter();
  const chirpQuery = api.chirp.getById.useQuery(
    { id: router.query.id as string },
    { enabled: !!router.query.id }
  );

  // if the chirp is a rechirp, users should be replying to the chirp that is rechirped
  const replyingToId = chirpQuery.data?.rechirpedFrom
    ? chirpQuery.data.rechirpedFrom.id
    : chirpQuery.data?.id;
  const replyingChirpsQuery = api.chirp.getInfinite.useInfiniteQuery(
    { replyingToId },
    {
      enabled: !!chirpQuery.data,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allChirps = useMemo(() => {
    return replyingChirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [replyingChirpsQuery.data?.pages]);

  const chirp = chirpQuery.data;

  return (
    <Layout
      seo={
        // TODO: rechirps
        chirp
          ? {
              title: `${chirp.author.displayName} on Chirp`,
              description: chirp.body,
              openGraph: {
                title: `${chirp.author.displayName} on Chirp`,
                description: chirp.body,
              },
            }
          : {}
      }
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/80 px-2 py-1.5 backdrop-blur-sm 2xl:pt-8">
        <div
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
          role="button"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon />
        </div>

        <div>
          <p className="text-xl font-bold">Chirp</p>
        </div>
      </div>

      <div
        className={cn(
          "border-b px-4 pb-2",
          chirpQuery.data?.replyingTo && "pt-2"
        )}
      >
        {chirpQuery.status === "loading" && (
          <Loader2Icon className="mx-auto my-4 animate-spin" />
        )}
        {chirpQuery.status === "success" && !chirpQuery.isPlaceholderData && (
          <ChirpBigView chirp={chirpQuery.data} />
        )}
      </div>

      {allChirps && chirpQuery.status === "success" && (
        <OnBottom
          onBottom={() => {
            if (replyingChirpsQuery.hasNextPage)
              replyingChirpsQuery.fetchNextPage().catch(() => 0);
          }}
        >
          <ChirpsList chirps={allChirps} showReplyingTo={false} />
        </OnBottom>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  ctx.res.setHeader("Cache-Control", "s-maxage=8, stale-while-revalidate");

  const ssg = createSsgHelpers();

  try {
    await ssg.chirp.getById.fetch({
      id: ctx.params?.id as string,
    });
  } catch (e: unknown) {
    if (e instanceof TRPCError && e.code === "NOT_FOUND") {
      return {
        notFound: true,
      };
    }
    throw e;
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default ChirpPage;
