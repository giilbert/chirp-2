import Link from "next/link";
import { MessageCircleIcon, RepeatIcon, ShareIcon } from "lucide-react";
import { ChirpProfilePicture } from "./profile-picture";
import { ChirpProfileCard } from "./profile-card";
import type { EverythingChirpWithoutNesting } from "@/server/api/routers/chirp";
import { LikeButton } from "./like-button";
import { useState } from "react";
import { CreateChirpDialog } from "./dialog";
import { ChirpMediaDisplay } from "./media-display";
import { useSession } from "next-auth/react";
import { ChirpRepostOptions } from "./repost-options";
import { ChirpRichText } from "./rich-text";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { useToast } from "@/lib/use-toast";
import { PurpleBadge } from "../user/purple-badge";
import { betterFormatDate } from "@/lib/utils";

export const ChirpCard: React.FC<{
  chirp: EverythingChirpWithoutNesting;
  showActions?: boolean;
}> = ({ chirp, showActions = true }) => {
  const { toast } = useToast();
  const [, copy] = useCopyToClipboard();
  const session = useSession();
  const [likes, setLikes] = useState(chirp._count.likes);

  return (
    <div className="flex flex-col gap-4 xs:flex-row">
      <div className="flex items-center gap-4 xs:items-start">
        <ChirpProfilePicture
          displayName={chirp.author.displayName}
          image={chirp.author.user.image}
        />
        {/* MOBILE: show the profile and post metadata above the content */}
        <div className="xs:hidden">
          <div className="flex items-center gap-1">
            <ChirpProfileCard chirp={chirp}>
              <Link href={`/${chirp.author.username}`}>
                <p className="group-hover:underline">
                  {chirp.author.displayName}
                </p>
              </Link>
            </ChirpProfileCard>
            {chirp.author.purple && <PurpleBadge />}
          </div>
          <div className="flex gap-1 text-muted-foreground">
            <p>@{chirp.author.username}</p>
            <p>·</p>
            <p>{betterFormatDate(chirp.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="hidden flex-wrap gap-1 text-muted-foreground xs:flex">
          <ChirpProfileCard chirp={chirp}>
            <Link href={`/${chirp.author.username}`}>
              <p className="text-foreground group-hover:underline">
                {chirp.author.displayName}
              </p>
            </Link>
          </ChirpProfileCard>

          {chirp.author.purple && <PurpleBadge />}

          <p>@{chirp.author.username}</p>
          <p>·</p>
          <p>{betterFormatDate(chirp.createdAt)}</p>
        </div>

        <div className="w-full">
          <ChirpRichText body={chirp.body} />
        </div>

        {chirp.media.length > 0 && (
          <div className="mt-2">
            <ChirpMediaDisplay media={chirp.media} />
          </div>
        )}

        {showActions && (
          <div className="actions -mb-2 -ml-2 mt-1 flex w-full flex-wrap gap-4 text-muted-foreground xs:justify-between">
            <CreateChirpDialog replyingToId={chirp.id}>
              <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-purple-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-purple-600/10">
                  <MessageCircleIcon size={18} className="transition-colors" />
                </div>
                <p className="text-sm transition-colors">
                  {chirp._count.replies}
                </p>
              </div>
            </CreateChirpDialog>

            <ChirpRepostOptions
              disabled={session.status !== "authenticated"}
              chirp={chirp}
            >
              <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-green-500">
                <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-green-600/10">
                  <RepeatIcon size={18} className="transition-colors" />
                </div>
                <p className="text-sm transition-colors">
                  {chirp._count.rechirps}
                </p>
              </div>
            </ChirpRepostOptions>

            <LikeButton
              chirpId={chirp.id}
              likes={likes}
              setLikes={setLikes}
              numbered={true}
              hasLiked={chirp.likes.length !== 0}
            />

            <div
              className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-purple-500"
              onClick={() => {
                copy(window.location.href)
                  .then(() => {
                    toast({
                      title: "Link copied to clipboard!",
                      description: "You can now paste the link anywhere.",
                    });
                  })
                  .catch((e) => {
                    console.error(e);
                    toast({
                      title: "Failed to copy link to clipboard.",
                      variant: "destructive",
                    });
                  });
              }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-purple-600/10">
                <ShareIcon size={18} className="transition-colors" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
