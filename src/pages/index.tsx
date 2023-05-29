import { type NextPage } from "next";
import { Layout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateChirpsForm } from "@/components/chirp/create-form";
import { Authed } from "@/components/layout/authed";
import { ChirpsList } from "@/components/chirp/list";
import { api } from "@/utils/api";
import { useMemo } from "react";
import { OnBottom } from "@/components/ui/on-bottom";

const Home: NextPage = () => {
  const recentChirpsQuery = api.chirp.getInfinite.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const allChirps = useMemo(() => {
    return recentChirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [recentChirpsQuery.data?.pages]);

  return (
    <Layout>
      <Tabs defaultValue="recent">
        <header className="sticky top-0 z-10 border-b bg-background/80 p-4 backdrop-blur-sm 2xl:pt-8">
          <h1 className="text-2xl font-bold">Home</h1>
          <TabsList className="mt-4 w-full">
            <TabsTrigger value="recent" className="w-full">
              Recent
            </TabsTrigger>
            <TabsTrigger value="following" className="w-full">
              Following
            </TabsTrigger>
          </TabsList>
        </header>

        <main>
          {/* chirp form */}
          <Authed>
            <section className="flex flex-col border-b p-4">
              <CreateChirpsForm />
            </section>
          </Authed>

          <TabsContent value="recent">
            <section>
              <OnBottom
                onBottom={() => {
                  if (recentChirpsQuery.hasNextPage)
                    recentChirpsQuery.fetchNextPage().catch(() => 0);
                }}
              >
                {recentChirpsQuery.status === "loading" && <p>TODO: Loading</p>}
                {recentChirpsQuery.status === "error" && <p>TODO: Error</p>}
                {allChirps && (
                  <ChirpsList chirps={allChirps} showReplyingTo={false} />
                )}
              </OnBottom>

              {
                <p className="p-4 text-center text-2xl text-muted-foreground">
                  {recentChirpsQuery.hasNextPage
                    ? "Loading..."
                    : "You reached the end"}
                </p>
              }
            </section>
          </TabsContent>

          <TabsContent value="following">
            <section className="mt-4">
              {/* TODO: following section */}
              <p>TODO!</p>
            </section>
          </TabsContent>
        </main>
      </Tabs>
    </Layout>
  );
};

export default Home;
