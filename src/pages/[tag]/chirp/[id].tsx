import { ChirpBigView } from "@/components/chirp/big-view";
import { ChirpsList } from "@/components/chirp/list";
import { Layout } from "@/components/layout";
import { OnBottom } from "@/components/ui/on-bottom";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useMemo } from "react";

const ChirpPage: React.FC = () => {
  const router = useRouter();
  const chirpQuery = api.chirp.getById.useQuery(
    { id: router.query.id as string },
    { enabled: !!router.query.id }
  );
  const replyingChirpsQuery = api.chirp.getInfinite.useInfiniteQuery(
    { replyingToId: chirpQuery.data?.id },
    {
      enabled: !!chirpQuery.data,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allChirps = useMemo(() => {
    return replyingChirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [replyingChirpsQuery.data?.pages]);

  return (
    <Layout>
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
        {chirpQuery.status === "success" && (
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

export default ChirpPage;
