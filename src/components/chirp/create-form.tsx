import { createChirpSchema } from "@/lib/schemas/chirp";
import { useZodForm } from "@/lib/use-zod-form";
import { api } from "@/utils/api";
import { useCallback, useState } from "react";
import type { z } from "zod";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ChirpMediaUpload } from "./media-upload";
import { FileImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { uploadFiles } from "@/utils/uploadthing-helpers";
import { useToast } from "@/lib/use-toast";

export const CreateChirpsForm: React.FC<{
  enlarged?: boolean;
  close?: () => void;
}> = ({ enlarged = false, close }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<{ file: File; url: string }[]>([]);
  const trpcContext = api.useContext();
  const form = useZodForm({ schema: createChirpSchema });
  const createChirp = api.chirp.create.useMutation();
  const session = useSession();
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    async (values: z.infer<typeof createChirpSchema>) => {
      setLoading(true);
      await createChirp.mutateAsync(values);
      if (files.length > 0)
        await uploadFiles(
          files.map((f) => f.file),
          "chirpAddMedia"
        );
      form.reset();
      files.forEach(({ url }) => URL.revokeObjectURL(url));
      setFiles([]);
      await trpcContext.chirp.getInfinite.invalidate();
      setLoading(false);
      toast({
        title: "Chirped!",
      });
      close?.();
    },
    [createChirp, form, trpcContext.chirp.getInfinite, files, close, toast]
  );

  return (
    <form
      onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
      className="flex max-w-full flex-col"
    >
      <div className="flex max-w-full">
        <div>
          <Avatar className="mt-2 h-12 w-12">
            <AvatarImage src={session.data?.user.image} />
            <AvatarFallback className="text-2xl">
              {session.data?.user.name
                .split(" ")
                .map((w) => w[0]?.toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="group ml-4 h-full w-full">
          <textarea
            disabled={loading}
            placeholder="What do you want to chirp about today?"
            className={cn(
              "mt-4 h-full w-full resize-none overflow-visible border-b bg-background pb-4 text-xl outline-none transition-colors group-focus-within:border-b-purple-600",
              enlarged ? "h-32" : "group-focus-within:h-32"
            )}
            {...form.register("body")}
          />

          {files.length !== 0 && (
            <p className="text-muted-foreground">
              {files.length} file{files.length !== 1 && "s"} selected
            </p>
          )}

          <div className="mt-2 flex">
            <div className="hidden text-purple-500 group-focus-within:block">
              <ChirpMediaUpload files={files} setFiles={setFiles}>
                <FileImageIcon />
              </ChirpMediaUpload>
            </div>

            <Button
              className="ml-auto w-24"
              size="sm"
              type="submit"
              isLoading={loading}
            >
              Chirp
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
