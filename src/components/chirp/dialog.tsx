import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateChirpsForm } from "./create-form";
import { CreateReplyForm } from "./reply-form";
import { useState } from "react";

export const CreateChirpDialog: React.FC<
  React.PropsWithChildren<{
    replyingToId?: string;
  }>
> = ({ children, replyingToId }) => {
  const [open, setOpen] = useState(false);
  const session = useSession();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <CreateReplyForm
            replyingToId={replyingToId}
            enlarged
            close={() => setOpen(false)}
          />
        ) : (
          <CreateChirpsForm enlarged close={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};
