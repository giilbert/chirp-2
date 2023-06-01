import moment from "moment";
import Link from "next/link";
import { MessageCircleIcon, RepeatIcon, ShareIcon } from "lucide-react";
import { ChirpProfilePicture } from "./profile-picture";
import { ChirpProfileCard } from "./profile-card";
import type { EverythingChirpWithoutReplying } from "@/server/api/routers/chirp";
import { LikeButton } from "./like-button";
import { useState } from "react";
import { CreateChirpDialog } from "./dialog";

const betterFormatDate = (date: Date) => {
  const dateMoment = moment(date);
  const now = moment();
  const diffHours = now.diff(dateMoment, "hours");
  const diffDays = now.diff(dateMoment, "days");

  // if the time is less than 6 hours ago, return a relative time
  if (diffHours < 6) return dateMoment.fromNow();

  // if it was more than a month ago, return a date
  if (diffDays > 30) {
    // if not in the same year, return a year
    if (now.year() !== dateMoment.year())
      return dateMoment.format("MMM D, YYYY");
    // otherwise return a month and day
    return dateMoment.format("MMM D");
  }

  // if the date is not the same, return a month and a day
  if (now.date() !== dateMoment.date()) return dateMoment.format("MMM D");

  // otherwise only return a time
  return dateMoment.format("H:MM A");
};

export const ChirpCard: React.FC<{
  chirp: EverythingChirpWithoutReplying;
  showActions?: boolean;
}> = ({ chirp, showActions = true }) => {
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
          <ChirpProfileCard author={chirp.author}>
            <Link href={`/${chirp.author.username}`}>
              <p className="group-hover:underline">
                {chirp.author.displayName}
              </p>
            </Link>
          </ChirpProfileCard>
          <div className="flex gap-1 text-muted-foreground">
            <p>@{chirp.author.username}</p>
            <p>·</p>
            <p>{betterFormatDate(chirp.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="hidden flex-wrap gap-1 text-muted-foreground xs:flex">
          <ChirpProfileCard author={chirp.author}>
            <Link href={`/${chirp.author.username}`}>
              <p className="text-foreground group-hover:underline">
                {chirp.author.displayName}
              </p>
            </Link>
          </ChirpProfileCard>
          <p>@{chirp.author.username}</p>
          <p>·</p>
          <p>{betterFormatDate(chirp.createdAt)}</p>
        </div>

        <p className="break-all">{chirp.body}</p>

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

            <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-green-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-green-600/10">
                <RepeatIcon size={18} className="transition-colors" />
              </div>
              <p className="text-sm transition-colors">
                {chirp._count.quotedBy + chirp._count.rechirps}
              </p>
            </div>

            <LikeButton
              chirpId={chirp.id}
              likes={likes}
              setLikes={setLikes}
              numbered={true}
              hasLiked={chirp.likes.length !== 0}
            />

            <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-purple-500">
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
