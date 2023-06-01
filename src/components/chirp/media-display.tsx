import type { ChirpMedia } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";

export const ChirpMediaDisplay: React.FC<{
  media: ChirpMedia[];
}> = ({ media }) => {
  return (
    <>
      {media.map((media) => (
        <Dialog key={media.id}>
          <DialogTrigger onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.mediaUrl}
              className="max-h-[400px] w-full rounded-md hover:brightness-90"
              alt="Image attached a chirp"
            />
          </DialogTrigger>

          <DialogOverlay className="fixed left-0 top-0 z-20 h-screen w-screen bg-background/80" />
          <DialogContent
            className="fixed left-1/2 top-1/2 z-20 w-3/4 -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.mediaUrl}
              className="w-full"
              alt="Image attached a chirp"
            />
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
};
