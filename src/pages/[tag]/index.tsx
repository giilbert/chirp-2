import { ChirpsList } from "@/components/chirp/list";
import { Layout } from "@/components/layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnBottom } from "@/components/ui/on-bottom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { ArrowLeftIcon, CalendarIcon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import { useMemo } from "react";

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const userProfileQuery = api.user.getUserProfileByTag.useQuery(
    { tag: router.query.tag as string },
    { enabled: !!router.query.tag }
  );
  const recentChirpsQuery = api.chirp.getInfiniteFromUser.useInfiniteQuery(
    {
      userId: userProfileQuery.data?.userId || "",
      filter: "chirps",
    },
    {
      enabled: !!userProfileQuery.data,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const recentReplyingChirpsQuery =
    api.chirp.getInfiniteFromUser.useInfiniteQuery(
      {
        userId: userProfileQuery.data?.userId || "",
        filter: "replies",
      },
      {
        enabled: !!userProfileQuery.data,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const recentMediaChirpsQuery = api.chirp.getInfiniteFromUser.useInfiniteQuery(
    {
      userId: userProfileQuery.data?.userId || "",
      filter: "media",
    },
    {
      enabled: !!userProfileQuery.data,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allChirps = useMemo(() => {
    return recentChirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [recentChirpsQuery.data?.pages]);

  const allReplies = useMemo(() => {
    return recentReplyingChirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [recentReplyingChirpsQuery.data?.pages]);

  const allMediaChirps = useMemo(() => {
    return recentMediaChirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [recentMediaChirpsQuery.data?.pages]);

  const profile = userProfileQuery.data;

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

        {profile && (
          <div>
            <p className="text-xl font-bold">{profile.displayName}</p>
            <p className="text-sm text-muted-foreground">
              {profile._count.chirps} Chirps
            </p>
          </div>
        )}
      </div>
      {userProfileQuery.status === "error" && <p>TODO: error</p>}
      {userProfileQuery.status === "success" && profile && (
        <Tabs defaultValue="chirps">
          <header className="border-b pb-4">
            <AspectRatio ratio={4 / 1} className="-z-10 w-full">
              <div className="h-full w-full bg-secondary-foreground/10"></div>
            </AspectRatio>

            <Avatar className="relative -top-12 left-4 h-24 w-24 rounded-full ring-4 ring-background lg:-top-20 lg:h-40 lg:w-40">
              <AvatarImage src={profile.user.image || undefined} />
              <AvatarFallback className="text-2xl lg:text-6xl">
                {profile.displayName
                  .split(" ")
                  .map((w) => w[0]?.toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="m-4 -mt-8 lg:-mt-16">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <CalendarIcon size={20} />
                Joined {moment(profile.createdAt).format("MMM YYYY")}
              </div>

              <div className="mt-2 flex gap-4">
                <p>
                  {/* TODO: make these number actual */}
                  <span className="mr-1 font-bold">0</span>
                  <span className="text-muted-foreground">Following</span>
                </p>
                <p>
                  <span className="mr-1 font-bold">0</span>
                  <span className="text-muted-foreground">Followers</span>
                </p>
              </div>
            </div>

            <div className="-mt-2 w-full px-4">
              <TabsList className="w-full">
                <TabsTrigger value="chirps" className="w-full">
                  Chirps
                </TabsTrigger>
                <TabsTrigger value="replies" className="w-full">
                  Replies
                </TabsTrigger>
                <TabsTrigger value="media" className="w-full">
                  Media
                </TabsTrigger>
                <TabsTrigger value="likes" className="w-full">
                  Likes
                </TabsTrigger>
              </TabsList>
            </div>
          </header>

          <main>
            <TabsContent value="chirps" className="mt-0">
              {allChirps && (
                <OnBottom
                  onBottom={() => {
                    if (recentChirpsQuery.hasNextPage) {
                      recentChirpsQuery.fetchNextPage().catch(() => 0);
                    }
                  }}
                >
                  <ChirpsList chirps={allChirps} />
                </OnBottom>
              )}
            </TabsContent>

            <TabsContent value="replies" className="mt-0">
              {allReplies && (
                <OnBottom
                  onBottom={() => {
                    if (recentReplyingChirpsQuery.hasNextPage) {
                      recentReplyingChirpsQuery.fetchNextPage().catch(() => 0);
                    }
                  }}
                >
                  <ChirpsList chirps={allReplies} />
                </OnBottom>
              )}
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              {allMediaChirps && (
                <OnBottom
                  onBottom={() => {
                    if (recentMediaChirpsQuery.hasNextPage) {
                      recentMediaChirpsQuery.fetchNextPage().catch(() => 0);
                    }
                  }}
                >
                  <ChirpsList chirps={allMediaChirps} />
                </OnBottom>
              )}
            </TabsContent>
          </main>
        </Tabs>
      )}
    </Layout>
  );
};

export default UserProfilePage;
