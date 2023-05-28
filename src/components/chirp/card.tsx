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
  HeartIcon,
  MessageCircleIcon,
  RepeatIcon,
  ShareIcon,
} from "lucide-react";

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
  chirp: Chirp & {
    author: Profile & {
      user: { image: string };
    };
  };
}> = ({ chirp }) => {
  return (
    <div className="flex gap-4">
      <div>
        <Avatar className="h-12 w-12 rounded-full">
          <AvatarImage src={chirp.author.user.image || undefined} />
          <AvatarFallback className="text-2xl lg:text-6xl">
            {chirp.author.displayName
              .split(" ")
              .map((w) => w[0]?.toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <div className="flex flex-wrap gap-1">
          <HoverCard>
            <HoverCardTrigger className="group cursor-pointer">
              <Link href={`/${chirp.author.username}`}>
                <p className="group-hover:underline">
                  {chirp.author.displayName}
                </p>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-80 text-foreground">
              <Avatar className="h-12 w-12 rounded-full">
                <AvatarImage src={chirp.author.user.image || undefined} />
                <AvatarFallback className="text-2xl lg:text-6xl">
                  {chirp.author.displayName
                    .split(" ")
                    .map((w) => w[0]?.toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <p className="mt-2">{chirp.author.displayName}</p>
              <p className="text-muted-foreground">@{chirp.author.username}</p>

              <div className="mt-2 flex gap-4">
                <p>
                  {/* TODO: make these number actual */}
                  <span className="mr-1 font-bold">6969</span>
                  <span className="text-muted-foreground">Following</span>
                </p>
                <p>
                  <span className="mr-1 font-bold">420</span>
                  <span className="text-muted-foreground">Followers</span>
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <p className="text-muted-foreground">@{chirp.author.username}</p>

          <p className="text-muted-foreground">·</p>

          <p className="text-muted-foreground">
            {betterFormatDate(chirp.createdAt)}
          </p>
        </div>

        <p className="break-all">{chirp.body}</p>

        <div className="-mb-2 -ml-2 mt-1 flex w-full justify-between gap-4 text-muted-foreground">
          <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-purple-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-purple-600/10">
              <MessageCircleIcon size={18} className="transition-colors" />
            </div>
            <p className="text-sm transition-colors">12.2k</p>
          </div>

          <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-green-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-green-600/10">
              <RepeatIcon size={18} className="transition-colors" />
            </div>
            <p className="text-sm transition-colors">12.2k</p>
          </div>

          <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-red-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-red-600/10">
              <HeartIcon size={18} className="transition-colors" />
            </div>
            <p className="text-sm transition-colors">12.2k</p>
          </div>

          <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-purple-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-purple-600/10">
              <BarChartIcon size={18} className="transition-colors" />
            </div>
            <p className="text-sm transition-colors">12.2k</p>
          </div>

          <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-purple-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-purple-600/10">
              <ShareIcon size={18} className="transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
