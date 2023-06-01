import type { Profile } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { ChirpProfilePicture } from "./profile-picture";
import { Button } from "../ui/button";

export const ChirpProfileCard: React.FC<
  React.PropsWithChildren<{
    author: Profile & { user: { image: string | null } };
  }>
> = ({ author, children }) => {
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
          <Button size="sm" className="ml-auto">
            Follow
          </Button>
        </div>

        <p className="mt-2">{author.displayName}</p>
        <p className="text-muted-foreground">@{author.username}</p>

        <div className="mt-2 flex gap-4">
          <p>
            {/* TODO: make these number actual */}
            <span className="mr-1 font-bold">0</span>
            <span className="text-muted-foreground">Following</span>
          </p>
          <p>
            <span className="mr-1 font-bold">0</span>
            <span className="text-muted-foreground">Followers</span>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
