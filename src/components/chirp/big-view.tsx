import type { Chirp, Profile } from "@prisma/client";
import moment from "moment";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import {
  BarChartIcon,
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

export const ChirpBigView: React.FC<{
  chirp: EverythingChirp;
}> = ({ chirp }) => {
  return (
    <>
      <div className="ml-2">
        <div className="border-l pl-4">
          {chirp.replyingTo && (
            <Link
              href={`/${chirp.replyingTo.author.username}/chirp/${chirp.replyingTo.id}`}
            >
              <div className="p-4 transition-colors hover:cursor-pointer hover:bg-muted/20">
                <ChirpCard chirp={chirp.replyingTo} />
              </div>
            </Link>
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

        <div className="mt-4 flex gap-8 border-t pt-4">
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

        <div className="mb-4 mt-4 flex justify-around gap-8 border-y pt-2">
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
