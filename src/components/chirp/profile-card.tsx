import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ChirpProfilePicture } from "./profile-picture";
import { Button } from "../ui/button";
import type { EverythingChirpWithoutNesting } from "@/server/api/routers/chirp";
import { api } from "@/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/lib/use-toast";
import { Authed } from "../layout/authed";
import { PurpleBadge } from "../user/purple-badge";

export const ChirpProfileCard: React.FC<
  React.PropsWithChildren<{
    chirp: EverythingChirpWithoutNesting;
  }>
> = ({ chirp, children }) => {
  const { toast } = useToast();
  const trpcContext = api.useContext();
  const followUser = api.user.followUser.useMutation();
  const unfollowUser = api.user.unfollowUser.useMutation();
  const [numFollowers, setNumFollowers] = useState(
    chirp.author._count.followers
  );
  const [hasFollowed, setHasFollowed] = useState(
    chirp.author.followers.length > 0
  );
  const { data: session } = useSession();

  const author = chirp.author;

  return (
    <HoverCard>
      <HoverCardTrigger className="group cursor-pointer" asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80 text-foreground">
        <div className="flex">
          <ChirpProfilePicture
            displayName={author.displayName}
            image={author.user.image}
          />
          <Authed>
            {session?.user?.id !== author.userId && (
              <>
                {hasFollowed ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="ml-auto"
                    isLoading={unfollowUser.isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      unfollowUser
                        .mutateAsync({
                          userId: author.userId,
                        })
                        .then(async () => {
                          toast({
                            title: "Unfollowed!",
                            description: `You are no longer following ${author.displayName}`,
                          });
                          setHasFollowed(false);
                          setNumFollowers(numFollowers - 1);

                          await trpcContext.user.getUserProfileByTag.invalidate();
                        })
                        .catch(console.error);
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="ml-auto"
                    isLoading={followUser.isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      followUser
                        .mutateAsync({
                          userId: author.userId,
                        })
                        .then(async () => {
                          toast({
                            title: "Followed!",
                            description: `You are now following ${author.displayName}`,
                          });

                          setHasFollowed(true);
                          setNumFollowers(numFollowers + 1);

                          await trpcContext.user.getUserProfileByTag.invalidate();
                        })
                        .catch(console.error);
                    }}
                  >
                    Follow
                  </Button>
                )}
              </>
            )}
          </Authed>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <p>{author.displayName}</p>
          {author.purple && <PurpleBadge />}
        </div>
        <p className="text-muted-foreground">@{author.username}</p>

        <p>{author.bio}</p>

        <div className="mt-2 flex gap-4">
          <p>
            <span className="mr-1 font-bold">{author._count.following}</span>
            <span className="text-muted-foreground">Following</span>
          </p>
          <p>
            <span className="mr-1 font-bold">{numFollowers}</span>
            <span className="text-muted-foreground">Followers</span>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
