import { ChirpsList } from "@/components/chirp/list";
import { ChirpSkeleton } from "@/components/chirp/skeleton";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnBottom } from "@/components/ui/on-bottom";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "@/components/user/list";
import { UserSkeleton } from "@/components/user/skeleton";
import { api } from "@/utils/api";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const SearchPage: NextPage = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("chirps");
  const [query, setQuery] = useState(router.query.q as string);
  const chirpsQuery = api.chirp.searchInfinite.useInfiniteQuery(
    {
      query: router.query.q as string,
    },
    {
      enabled: !!router.query.q && selectedTab === "chirps",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const usersQuery = api.user.searchInfinite.useInfiniteQuery(
    {
      query: router.query.q as string,
    },
    {
      enabled: !!router.query.q && selectedTab === "users",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allChirps = useMemo(() => {
    return chirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [chirpsQuery.data?.pages]);

  const allUsers = useMemo(() => {
    return usersQuery.data?.pages.flatMap((p) => p.profiles);
  }, [usersQuery.data?.pages]);

  return (
    <Layout
      noSearch
      seo={{
        title: "Search / Chirp",
      }}
    >
      <Tabs defaultValue="chirps" onValueChange={setSelectedTab}>
        <div className="sticky top-0 z-10 border-b bg-background/80 p-4 pb-2 backdrop-blur-sm">
          <h1 className="mb-2 text-2xl font-bold">Search</h1>
          <div className="flex items-center gap-2 2xl:pt-8">
            <form
              className="mb-2 flex w-full gap-2"
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
                placeholder="Enter your query..."
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

          <TabsList className="w-full">
            <TabsTrigger value="chirps" className="w-full">
              Chirps
            </TabsTrigger>
            <TabsTrigger value="users" className="w-full">
              Users
            </TabsTrigger>
          </TabsList>
        </div>

        {!router.query.q && (
          <div className="m-4 text-muted-foreground">
            <p>Search for something!</p>
          </div>
        )}

        <TabsContent value="chirps" className="mt-0">
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
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          {router.query.q && usersQuery.status === "loading" && (
            <>
              {Array.from({ length: 7 }).map((_, i) => (
                <UserSkeleton key={i} />
              ))}
            </>
          )}

          {usersQuery.status === "success" &&
            allUsers &&
            (allUsers.length !== 0 ? (
              <OnBottom
                onBottom={() => {
                  if (usersQuery.hasNextPage) {
                    usersQuery.fetchNextPage().catch(() => 0);
                  }
                }}
              >
                <UserList users={allUsers} />
              </OnBottom>
            ) : (
              <div className="m-4 text-muted-foreground">
                <p>No users found</p>
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default SearchPage;
