import moment from "moment";
import Link from "next/link";
import {
  // BookmarkIcon,
  MessageCircleIcon,
  RepeatIcon,
  ReplyIcon,
  ShareIcon,
} from "lucide-react";
import { ChirpProfilePicture } from "./profile-picture";
import { ChirpProfileCard } from "./profile-card";
import { CreateReplyForm } from "./reply-form";
import type {
  EverythingChirp,
  EverythingChirpWithoutNesting,
} from "@/server/api/routers/chirp";
import { ChirpCard } from "./card";
import { useRouter } from "next/router";
import { LikeButton } from "./like-button";
import { createRef, useState } from "react";
import { ChirpMediaDisplay } from "./media-display";
import { Authed } from "../layout/authed";
import { ChirpRepostOptions } from "./repost-options";
import { useSession } from "next-auth/react";
import { ChirpRichText } from "./rich-text";
import { useToast } from "@/lib/use-toast";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { PurpleBadge } from "../user/purple-badge";

export const ChirpBigView: React.FC<{
  chirp: EverythingChirp | EverythingChirpWithoutNesting;
}> = ({ chirp }) => {
  const { toast } = useToast();
  const [, copy] = useCopyToClipboard();
  const session = useSession();
  const replyTextareaRef = createRef<HTMLTextAreaElement>();
  const [likes, setLikes] = useState(chirp._count.likes);
  const router = useRouter();

  if ("rechirpedFrom" in chirp && chirp.rechirpedFrom)
    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ReplyIcon size={16} />

          <ChirpProfileCard chirp={chirp}>
            <Link href={`/${chirp.author.username}`}>
              <p className="group-hover:underline">
                {chirp.author.displayName} rechirped
              </p>
            </Link>
          </ChirpProfileCard>
        </div>

        <div className="-mt-4">
          <ChirpBigView chirp={chirp.rechirpedFrom} />
        </div>
      </div>
    );

  return (
    <>
      <div className="ml-1">
        <div className="border-l pl-1">
          {"replyingTo" in chirp && chirp.replyingTo && (
            <div
              className="p-2 transition-colors hover:cursor-pointer hover:bg-muted/20"
              onClick={(e) => {
                // dont navigate if the user is clicking a link
                if ((e.target as HTMLElement).closest("a")) return;

                router
                  .push(
                    `/${chirp.replyingTo?.author.username || ""}/chirp/${
                      chirp.replyingTo?.id || ""
                    }`
                  )
                  .catch(() => 0);
              }}
            >
              <ChirpCard chirp={chirp.replyingTo} />
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <div className="flex">
          <ChirpProfilePicture
            image={chirp.author.user.image}
            displayName={chirp.author.displayName}
          />
          <div className="ml-4">
            <div className="flex items-center gap-2">
              <ChirpProfileCard chirp={chirp}>
                <Link href={`/${chirp.author.username}`}>
                  <p className="group-hover:underline">
                    {chirp.author.displayName}
                  </p>
                </Link>
              </ChirpProfileCard>

              {chirp.author.purple && <PurpleBadge />}
            </div>
            <p className="-mt-2 text-muted-foreground">
              @{chirp.author.username}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <ChirpRichText body={chirp.body} />

        <div className="mt-2">
          <ChirpMediaDisplay media={chirp.media} />
        </div>

        <div className="mt-2 flex gap-1 text-muted-foreground">
          <p>{moment(chirp.createdAt).format("h:mm A")}</p>
          <p>·</p>
          <p>{moment(chirp.createdAt).format("MMM D, YYYY")}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t pt-4 md:gap-8">
          <p>
            <span className="mr-1 font-bold">{chirp._count.rechirps}</span>
            <span className="text-muted-foreground">Rechirps</span>
          </p>
          <p>
            <span className="mr-1 font-bold">{likes}</span>
            <span className="text-muted-foreground">Likes</span>
          </p>
          {/*
          <p>
            <span className="mr-1 font-bold">0</span>
            <span className="text-muted-foreground">Bookmarks</span>
          </p>
          */}
        </div>

        <div className="mb-4 mt-4 flex flex-wrap justify-around border-y py-2 md:gap-8">
          <div
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-purple-600/10 hover:text-purple-500"
            onClick={() => {
              if (replyTextareaRef.current) replyTextareaRef.current.focus();
            }}
          >
            <MessageCircleIcon size={20} className="transition-colors" />
          </div>

          <ChirpRepostOptions
            disabled={session.status !== "authenticated"}
            chirp={chirp}
          >
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-green-600/10 hover:text-green-500">
              <RepeatIcon size={20} className="transition-colors" />
            </div>
          </ChirpRepostOptions>

          <LikeButton
            chirpId={chirp.id}
            numbered={false}
            likes={likes}
            setLikes={setLikes}
            hasLiked={chirp.likes.length !== 0}
          />

          {/*
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-purple-600/10 hover:text-purple-500">
            <BookmarkIcon size={20} className="transition-colors" />
          </div>
          */}

          <div
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-purple-600/10 hover:text-purple-500"
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
            <ShareIcon size={20} className="transition-colors" />
          </div>
        </div>

        <Authed>
          <CreateReplyForm replyingToId={chirp.id} ref={replyTextareaRef} />
        </Authed>
      </div>
    </>
  );
};
