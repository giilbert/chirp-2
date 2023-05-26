import type { Chirp, Profile } from "@prisma/client";
import { ChirpCard } from "./card";

export const ChirpsList: React.FC<{
  chirps: (Chirp & { author: Profile })[];
}> = ({ chirps }) => {
  if (chirps.length === 0) {
    return (
      <p className="m-6 text-2xl text-muted-foreground">No Chirps yet :(</p>
    );
  }

  return (
    <>
      {chirps.map((chirp) => (
        <div key={chirp.id} className="border-b px-6 py-4">
          <ChirpCard chirp={chirp} />
        </div>
      ))}
    </>
  );
};
