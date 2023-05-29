import moment from "moment";
import Link from "next/link";
import {
  HeartIcon,
  MessageCircleIcon,
  RepeatIcon,
  ShareIcon,
} from "lucide-react";
import { ChirpProfilePicture } from "./profile-picture";
import { ChirpProfileCard } from "./profile-card";
import type { EverythingChirpWithoutReplying } from "@/server/api/routers/chirp";

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
  return (
    <div className="flex gap-4">
      <div>
        <ChirpProfilePicture
          displayName={chirp.author.displayName}
          image={chirp.author.user.image}
        />
      </div>
      <div className="w-full">
        <div className="flex flex-wrap gap-1">
          <ChirpProfileCard author={chirp.author}>
            <Link href={`/${chirp.author.username}`}>
              <p className="group-hover:underline">
                {chirp.author.displayName}
              </p>
            </Link>
          </ChirpProfileCard>
          <p className="text-muted-foreground">@{chirp.author.username}</p>

          <p className="text-muted-foreground">·</p>

          <p className="text-muted-foreground">
            {betterFormatDate(chirp.createdAt)}
          </p>
        </div>

        <p className="break-all">{chirp.body}</p>

        {showActions && (
          <div className="-mb-2 -ml-2 mt-1 flex w-full flex-wrap gap-2 text-muted-foreground sm:justify-between md:gap-4">
            <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-purple-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-purple-600/10">
                <MessageCircleIcon size={18} className="transition-colors" />
              </div>
              <p className="text-sm transition-colors">
                {chirp._count.replies}
              </p>
            </div>

            <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-green-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-green-600/10">
                <RepeatIcon size={18} className="transition-colors" />
              </div>
              <p className="text-sm transition-colors">
                {chirp._count.quotedBy + chirp._count.rechirps}
              </p>
            </div>

            <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-red-500">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-red-600/10"
                onClick={(e) => {
                  console.log("liking chirp");
                  e.stopPropagation();
                }}
              >
                <HeartIcon size={18} className="transition-colors" />
              </div>
              <p className="text-sm transition-colors">{chirp._count.likes}</p>
            </div>

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
