import { createChirpSchema } from "@/lib/schemas/chirp";
import { useZodForm } from "@/lib/use-zod-form";
import { api } from "@/utils/api";
import { useCallback } from "react";
import type { z } from "zod";
import { Button } from "../ui/button";

export const CreateReplyForm: React.FC<{ replyingToId: string }> = ({
  replyingToId,
}) => {
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
          className="ml-4 mt-4 h-10 w-full resize-none overflow-visible border-b bg-background pb-4 text-xl outline-none transition-colors group-focus-within:h-24 group-focus-within:border-b-purple-600"
          {...form.register("body")}
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
};
