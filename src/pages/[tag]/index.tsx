import { ChirpsList } from "@/components/chirp/list";
import { Layout } from "@/components/layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo } from "react";

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const userProfileQuery = api.user.getUserProfileByTag.useQuery(
    { tag: router.query.tag as string },
    { enabled: !!router.query.tag }
  );
  const recentChirpsQuery = api.chirp.getInfinite.useInfiniteQuery(
    {
      fromUserId: userProfileQuery.data?.userId,
    },
    {
      enabled: !!userProfileQuery.data,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const allChirps = useMemo(() => {
    return recentChirpsQuery.data?.pages.flatMap((p) => p.chirps);
  }, [recentChirpsQuery.data?.pages]);

  const profile = userProfileQuery.data;

  return (
    <Layout>
      {userProfileQuery.status === "success" && profile && (
        <Tabs defaultValue="chirps">
          <header className="border-b pb-4">
            <AspectRatio ratio={4 / 1} className="w-full">
              <div className="h-full w-full bg-secondary-foreground/10"></div>
            </AspectRatio>

            <Avatar className="relative -top-12 left-6 h-24 w-24 rounded-full bg-gray-500 ring-4 ring-background lg:-top-20 lg:h-40 lg:w-40">
              <AvatarImage src={profile.user.image || undefined} />
              <AvatarFallback className="text-2xl lg:text-6xl">
                {profile.displayName
                  .split(" ")
                  .map((w) => w[0]?.toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="m-6 -mt-8 lg:-mt-16">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <CalendarIcon size={20} />
                Joined {moment(profile.createdAt).format("MMM YYYY")}
              </div>

              <div className="mt-2 flex gap-4">
                <p>
                  <span className="mr-1 font-bold">6969</span>
                  <span className="text-muted-foreground">Following</span>
                </p>
                <p>
                  <span className="mr-1 font-bold">420</span>
                  <span className="text-muted-foreground">Followers</span>
                </p>
              </div>
            </div>

            <div className="-mt-2 w-full px-6">
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
            <TabsContent value="chirps">
              {allChirps && <ChirpsList chirps={allChirps} />}
            </TabsContent>
          </main>
        </Tabs>
      )}
    </Layout>
  );
};

export default UserProfilePage;
