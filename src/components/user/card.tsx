import type { EverythingUser } from "@/server/api/routers/user";
import { ChirpProfilePicture } from "../chirp/profile-picture";
import Link from "next/link";
import { PurpleBadge } from "./purple-badge";

export const UserCard: React.FC<{
  user: EverythingUser;
}> = ({ user }) => {
  return (
    <Link href={`/${user.username}`}>
      <div className="flex flex-wrap gap-4 border-b p-4 hover:bg-muted/20">
        <ChirpProfilePicture
          image={user.user.image}
          displayName={user.displayName}
        />
        <div>
          <div className="flex items-center gap-1">
            <p>{user.displayName}</p>
            {user.purple && <PurpleBadge />}
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          <p>{user.bio}</p>

          <div className="mt-2 flex flex-wrap gap-4">
            <p>
              <span className="mr-1 font-bold">{user._count.chirps}</span>
              <span className="text-muted-foreground">Chirps</span>
            </p>
            <p>
              <span className="mr-1 font-bold">{user._count.following}</span>
              <span className="text-muted-foreground">Following</span>
            </p>
            <p>
              <span className="mr-1 font-bold">{user._count.followers}</span>
              <span className="text-muted-foreground">Followers</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
