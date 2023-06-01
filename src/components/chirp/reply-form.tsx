import { createChirpSchema } from "@/lib/schemas/chirp";
import { useZodForm } from "@/lib/use-zod-form";
import { api } from "@/utils/api";
import { forwardRef, useCallback } from "react";
import type { z } from "zod";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { mergeRefs } from "react-merge-refs";

export const CreateReplyForm = forwardRef<
  HTMLTextAreaElement,
  {
    replyingToId: string;
    enlarged?: boolean;
  }
>(({ replyingToId, enlarged = false }, ref) => {
  const trpcContext = api.useContext();
  const form = useZodForm({ schema: createChirpSchema });
  const createChirp = api.chirp.create.useMutation();

  const onSubmit = useCallback(
    async (values: z.infer<typeof createChirpSchema>) => {
      await createChirp.mutateAsync({
        replyingToId,
        ...values,
      });
      form.reset();
      await trpcContext.chirp.getInfinite.invalidate();
    },
    [createChirp, form, trpcContext.chirp.getInfinite, replyingToId]
  );

  return (
    <form
      onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
      className="group flex max-w-full flex-col"
    >
      <div className="flex max-w-full">
        <div>
          <div className="mt-2 h-12 w-12 rounded-full bg-gray-400" />
        </div>

        <textarea
          disabled={createChirp.isLoading}
          placeholder="Chirp your reply!"
          className={cn(
            "ml-4 mt-4 h-full w-full resize-none overflow-visible border-b bg-background pb-4 text-xl outline-none transition-colors group-focus-within:border-b-purple-600",
            enlarged ? "h-32" : "group-focus-within:h-32"
          )}
          {...form.register("body")}
          ref={mergeRefs([form.register("body").ref, ref])}
        />
      </div>

      <Button
        className="ml-auto mt-2 w-24"
        size="sm"
        type="submit"
        isLoading={createChirp.isLoading}
      >
        Reply
      </Button>
    </form>
  );
});

CreateReplyForm.displayName = "CreateReplyForm";
