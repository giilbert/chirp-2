import { ChirpCard } from "./card";
import Link from "next/link";
import type { EverythingChirp } from "@/server/api/routers/chirp";
import { useRouter } from "next/router";

export const ChirpsList: React.FC<{
  chirps: EverythingChirp[];
}> = ({ chirps }) => {
  const router = useRouter();

  if (chirps.length === 0) {
    return (
      <p className="m-6 text-lg text-muted-foreground">No Chirps yet :(</p>
    );
  }

  return (
    <>
      {chirps.map((chirp) => (
        <div key={chirp.id}>
          {chirp.replyingTo && (
            <div className="ml-4 mt-4">
              <div className="mb-2 border-l pl-4">
                <ChirpCard chirp={chirp.replyingTo} showActions={false} />
              </div>
            </div>
          )}
          <div
            className="border-b p-4 transition-colors hover:cursor-pointer hover:bg-muted/20"
            onClick={() => {
              router
                .push(`/${chirp.author.username}/chirp/${chirp.id}`)
                .catch(() => 0);
            }}
          >
            <ChirpCard chirp={chirp} />
          </div>
        </div>
      ))}
    </>
  );
};
