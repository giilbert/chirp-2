import type { Chirp, Profile } from "@prisma/client";
import { ChirpCard } from "./card";
import Link from "next/link";

export const ChirpsList: React.FC<{
  chirps: (Chirp & { author: Profile & { user: { image: string | null } } })[];
}> = ({ chirps }) => {
  if (chirps.length === 0) {
    return (
      <p className="m-6 text-lg text-muted-foreground">No Chirps yet :(</p>
    );
  }

  return (
    <>
      {chirps.map((chirp) => (
        <Link
          key={chirp.id}
          href={`/${chirp.author.username}/chirp/${chirp.id}`}
        >
          <div className="border-b px-6 py-4 transition-colors hover:cursor-pointer hover:bg-muted/20">
            <ChirpCard chirp={chirp} />
          </div>
        </Link>
      ))}
    </>
  );
};
