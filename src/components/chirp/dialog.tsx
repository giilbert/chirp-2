import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../layout/dialog";
import { CreateChirpsForm } from "./create-form";
import { CreateReplyForm } from "./reply-form";

export const CreateChirpDialog: React.FC<
  React.PropsWithChildren<{
    replyingToId?: string;
  }>
> = ({ children, replyingToId }) => {
  const session = useSession();

  return (
    <Dialog>
      {session.status === "authenticated" ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        children
      )}

      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{replyingToId ? "Reply" : "Create Chirp"}</DialogTitle>
        </DialogHeader>
        {replyingToId ? (
          <CreateReplyForm replyingToId={replyingToId} enlarged />
        ) : (
          <CreateChirpsForm enlarged />
        )}
      </DialogContent>
    </Dialog>
  );
};
