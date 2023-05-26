import type { Chirp, Profile } from "@prisma/client";
import moment from "moment";

const betterFormatDate = (date: Date) => {
  const dateMoment = moment(date);
  const now = moment();

  // if the current date is not the same, return a full date
  if (dateMoment.date() !== now.date()) return dateMoment.format();

  // otherwise only return a time
  return dateMoment.format("HH:MM:SS A");
};

export const ChirpCard: React.FC<{ chirp: Chirp & { author: Profile } }> = ({
  chirp,
}) => {
  return (
    <div className="flex gap-4">
      <div>
        <div className="h-12 w-12 rounded-full bg-gray-400" />
      </div>
      <div>
        <div className="flex gap-1">
          <p>{chirp.author.displayName}</p>
          <p className="text-muted-foreground">@{chirp.author.username}</p>

          <p className="text-muted-foreground">
            &#11049; {betterFormatDate(chirp.createdAt)}
          </p>
        </div>

        <p>{chirp.body}</p>
      </div>
    </div>
  );
};
