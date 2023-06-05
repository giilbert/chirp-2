import { ChirpsList } from "@/components/chirp/list";
import { Layout } from "@/components/layout";
import { Authed } from "@/components/layout/authed";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { OnBottom } from "@/components/ui/on-bottom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserEditProfileForm } from "@/components/user/edit-profile-form";
import { useToast } from "@/lib/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { createSsgHelpers } from "@/utils/ssg-helpers";
import { TRPCError } from "@trpc/server";
import { ArrowLeftIcon, CalendarIcon } from "lucide-react";
import moment from "moment";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { ErrorMessage } from "@/components/layout/error-message";
import { PurpleBadge } from "@/components/user/purple-badge";

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("chirps");
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);

  const follow = api.user.followUser.useMutation();
  const unfollow = api.user.unfollowUser.useMutation();

  const userProfileQuery = api.user.getUserProfileByTag.useQuery(
    { tag: router.query.tag as string },
    { enabled: !!router.query.tag }
  );

  const userId = userProfileQuery.data?.userId || "";
  const enabled = userProfileQuery.isSuccess;
  const recentChirpsQuery = api.chirp.getInfiniteFromUser.useInfiniteQuery(
    { userId, filter: "chirps" },
    {
      enabled: enabled && selectedTab === "chirps",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const recentReplyingChirpsQuery =
    api.chirp.getInfiniteFromUser.useInfiniteQuery(
      { userId, filter: "replies" },
      {
        enabled: enabled && selectedTab === "replies",
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  const recentMediaChirpsQuery = api.chirp.getInfiniteFromUser.useInfiniteQuery(
    { userId, filter: "media" },
    {
      enabled: enabled && selectedTab === "media",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const recentLikedChirpsQuery = api.chirp.getInfiniteFromUser.useInfiniteQuery(
    { userId, filter: "likes" },
    {
      enabled: enabled && selectedTab === "likes",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const allChirps = useMemo(
    () => recentChirpsQuery.data?.pages.flatMap((p) => p.chirps),
    [recentChirpsQuery.data?.pages]
  );

  const allReplies = useMemo(
    () => recentReplyingChirpsQuery.data?.pages.flatMap((p) => p.chirps),
    [recentReplyingChirpsQuery.data?.pages]
  );

  const allMediaChirps = useMemo(
    () => recentMediaChirpsQuery.data?.pages.flatMap((p) => p.chirps),
    [recentMediaChirpsQuery.data?.pages]
  );

  const allLikedChirps = useMemo(
    () => recentLikedChirpsQuery.data?.pages.flatMap((p) => p.chirps),
    [recentLikedChirpsQuery.data?.pages]
  );

  const profile = userProfileQuery.data;
  const isMe = profile?.userId === session.data?.user.id;

  return (
    <Layout
      seo={{
        title: profile
          ? `${profile.displayName} (@${profile.username}) / Chirp`
          : "Profile / Chirp",
        description: profile?.bio || "This user doesn't have a bio.",
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

        {profile && (
          <div>
            <p className="text-xl font-bold">{profile.displayName}</p>
            <p className="text-sm text-muted-foreground">
              {profile._count.chirps} Chirps
            </p>
          </div>
        )}

        {isMe && (
          <Dialog
            open={editProfileDialogOpen}
            onOpenChange={setEditProfileDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="ml-auto h-min w-32">Edit</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>

              {profile && (
                <UserEditProfileForm
                  profile={profile}
                  setOpen={setEditProfileDialogOpen}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {userProfileQuery.status === "error" && (
        <ErrorMessage error={userProfileQuery.error} />
      )}

      {userProfileQuery.status === "success" && profile && (
        <Tabs
          defaultValue="chirps"
          onValueChange={(value) => {
            setSelectedTab(value);
          }}
        >
          <header className="border-b pb-4">
            <AspectRatio ratio={4 / 1} className="-z-10 w-full">
              <div className="h-full w-full bg-secondary-foreground/10">
                {profile.headerUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-full w-full"
                    src={profile.headerUrl}
                    alt=""
                  />
                )}
              </div>
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

            {!isMe && (
              <div className="-mt-20 flex h-10 w-full pr-4 lg:-mt-36 lg:mb-10">
                <Authed>
                  {profile.followers.length === 0 ? (
                    <Button
                      className="ml-auto"
                      size="sm"
                      isLoading={follow.isLoading || userProfileQuery.isLoading}
                      onClick={() => {
                        follow
                          .mutateAsync({ userId: profile.userId })
                          .then(async () => {
                            await userProfileQuery.refetch();

                            toast({
                              title: "Followed!",
                              description: `You are now following ${profile.displayName}`,
                            });
                          })
                          .catch(console.error);
                      }}
                    >
                      Follow
                    </Button>
                  ) : (
                    <Button
                      className="ml-auto"
                      size="sm"
                      variant="secondary"
                      isLoading={
                        unfollow.isLoading || userProfileQuery.isLoading
                      }
                      onClick={() => {
                        unfollow
                          .mutateAsync({ userId: profile.userId })
                          .then(async () => {
                            await userProfileQuery.refetch();

                            toast({
                              title: "Unfollowed!",
                              description: `You are no longer following ${profile.displayName}`,
                            });
                          })
                          .catch(console.error);
                      }}
                    >
                      Unfollow
                    </Button>
                  )}
                </Authed>
              </div>
            )}

            <div className={cn("m-4", isMe ? "-mt-8 lg:-mt-16" : "mt-0")}>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                {profile.purple && <PurpleBadge />}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.bio && <p className="mt-2">{profile.bio}</p>}
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <CalendarIcon size={20} />
                Joined {moment(profile.createdAt).format("MMM YYYY")}
              </div>

              <div className="mt-2 flex gap-4">
                <p>
                  <span className="mr-1 font-bold">
                    {profile._count.following}
                  </span>
                  <span className="text-muted-foreground">Following</span>
                </p>
                <p>
                  <span className="mr-1 font-bold">
                    {profile._count.followers}
                  </span>
                  <span className="text-muted-foreground">Followers</span>
                </p>
              </div>
            </div>

            <div className="w-full px-4">
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

            <TabsContent value="likes" className="mt-0">
              {allLikedChirps && (
                <OnBottom
                  onBottom={() => {
                    if (recentLikedChirpsQuery.hasNextPage) {
                      recentLikedChirpsQuery.fetchNextPage().catch(() => 0);
                    }
                  }}
                >
                  <ChirpsList chirps={allLikedChirps} />
                </OnBottom>
              )}
            </TabsContent>
          </main>
        </Tabs>
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = createSsgHelpers();

  try {
    await ssg.user.getUserProfileByTag.fetch({
      tag: ctx.params?.tag as string,
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
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default UserProfilePage;
