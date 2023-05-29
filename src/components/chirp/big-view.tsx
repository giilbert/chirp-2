import moment from "moment";
import Link from "next/link";
import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  RepeatIcon,
  ShareIcon,
} from "lucide-react";
import { ChirpProfilePicture } from "./profile-picture";
import { ChirpProfileCard } from "./profile-card";
import { CreateReplyForm } from "./reply-form";
import type { EverythingChirp } from "@/server/api/routers/chirp";
import { ChirpCard } from "./card";
import { useRouter } from "next/router";

export const ChirpBigView: React.FC<{
  chirp: EverythingChirp;
}> = ({ chirp }) => {
  const router = useRouter();

  return (
    <>
      <div className="ml-1">
        <div className="border-l pl-1">
          {chirp.replyingTo && (
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
            <ChirpProfileCard author={chirp.author}>
              <Link href={`/${chirp.author.username}`}>
                <p className="group-hover:underline">
                  {chirp.author.displayName}
                </p>
              </Link>
            </ChirpProfileCard>
            <p className="-mt-2 text-muted-foreground">
              @{chirp.author.username}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p>{chirp.body}</p>

        <div className="mt-2 flex gap-1 text-muted-foreground">
          <p>{moment(chirp.createdAt).format("h:mm A")}</p>
          <p>·</p>
          <p>{moment(chirp.createdAt).format("MMM D, YYYY")}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t pt-4 md:gap-8">
          <p>
            <span className="mr-1 font-bold">420</span>
            <span className="text-muted-foreground">Rechirps</span>
          </p>
          <p>
            <span className="mr-1 font-bold">493</span>
            <span className="text-muted-foreground">Quotes</span>
          </p>
          <p>
            <span className="mr-1 font-bold">60.9k</span>
            <span className="text-muted-foreground">Likes</span>
          </p>
          <p>
            <span className="mr-1 font-bold">219</span>
            <span className="text-muted-foreground">Bookmarks</span>
          </p>
        </div>

        <div className="mb-4 mt-4 flex flex-wrap justify-around border-y py-2 md:gap-8">
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-purple-600/10 hover:text-purple-500">
            <MessageCircleIcon size={20} className="transition-colors" />
          </div>

          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-green-600/10 hover:text-green-500">
            <RepeatIcon size={20} className="transition-colors" />
          </div>

          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-600/10 hover:text-red-500">
            <HeartIcon size={20} className="transition-colors" />
          </div>

          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-purple-600/10 hover:text-purple-500">
            <BookmarkIcon size={20} className="transition-colors" />
          </div>

          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-purple-600/10 hover:text-purple-500">
            <ShareIcon size={20} className="transition-colors" />
          </div>
        </div>

        <CreateReplyForm replyingToId={chirp.id} />
      </div>
    </>
  );
};
