import { ChirpsList } from "@/components/chirp/list";
import { ChirpSkeleton } from "@/components/chirp/skeleton";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnBottom } from "@/components/ui/on-bottom";
import { api } from "@/utils/api";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const SearchPage: NextPage = () => {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.q as string);
  const chirpsQuery = api.chirp.searchInfinite.useInfiniteQuery(
    {
      query: router.query.q as string,
    },
    {
      enabled: !!router.query.q,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allChirps = useMemo(() => {
    return chirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [chirpsQuery.data?.pages]);

  return (
    <Layout
      noSearch
      seo={{
        title: "Search / Chirp",
      }}
    >
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/80 px-2 py-1.5 backdrop-blur-sm 2xl:pt-8">
        <div
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
          role="button"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon />
        </div>

        <form
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (query === "") return;
            router
              .push(`/search?q=${encodeURIComponent(query)}`)
              .catch(() => 0);
          }}
        >
          <Input
            className="w-full"
            defaultValue={router.query.q as string}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Button className="w-8">
            <SearchIcon size={20} />
          </Button>
        </form>
      </div>

      {!router.query.q && (
        <div className="m-4 text-muted-foreground">
          <p>Search for something!</p>
        </div>
      )}

      {router.query.q && chirpsQuery.status === "loading" && (
        <>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="border-b p-4">
              <ChirpSkeleton />
            </div>
          ))}
        </>
      )}

      {chirpsQuery.status === "success" &&
        allChirps &&
        (allChirps.length !== 0 ? (
          <OnBottom
            onBottom={() => {
              if (chirpsQuery.hasNextPage) {
                chirpsQuery.fetchNextPage().catch(() => 0);
              }
            }}
          >
            <ChirpsList chirps={allChirps} />
          </OnBottom>
        ) : (
          <div className="m-4 text-muted-foreground">
            <p>No chirps found</p>
          </div>
        ))}
    </Layout>
  );
};

export default SearchPage;
