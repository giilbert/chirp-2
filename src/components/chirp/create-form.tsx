import { createChirpSchema } from "@/lib/schemas/chirp";
import { useZodForm } from "@/lib/use-zod-form";
import { api } from "@/utils/api";
import { useCallback } from "react";
import type { z } from "zod";
import { Button } from "../ui/button";

export const CreateChirpsForm: React.FC = () => {
  const trpcContext = api.useContext();
  const form = useZodForm({ schema: createChirpSchema });
  const createChirp = api.chirp.create.useMutation();

  const onSubmit = useCallback(
    async (values: z.infer<typeof createChirpSchema>) => {
      await createChirp.mutateAsync(values);
      form.reset();
      await trpcContext.chirp.getInfinite.invalidate();
    },
    [createChirp, form, trpcContext.chirp.getInfinite]
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
          placeholder="What do you want to complain about today?"
          className="ml-4 mt-4 h-full w-full resize-none overflow-visible border-b bg-background pb-4 text-xl outline-none transition-colors group-focus-within:h-32 group-focus-within:border-b-purple-600"
          {...form.register("body")}
        />
      </div>

      <Button
        className="ml-auto mt-2 w-24"
        size="sm"
        type="submit"
        isLoading={createChirp.isLoading}
      >
        Chirp
      </Button>
    </form>
  );
};
