import { Button } from "@/components/ui/button";
import { TsForm } from "@/components/ui/forms";
import { completeSignUpSchema } from "@/lib/schemas/user";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import type { z } from "zod";

const CompleteSignUp: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const completeSignUp = api.user.completeSignUp.useMutation();
  const redirectUrl = router.query.redirect as string | undefined;

  const onSubmit = useCallback(
    async (values: z.infer<typeof completeSignUpSchema>) => {
      await completeSignUp.mutateAsync(values);
      await session.update();
      await router.push(redirectUrl ?? "/").catch(() => 0);
    },
    [completeSignUp, redirectUrl, router, session]
  );

  if (session.status === "loading") {
    // TODO: loading state
    return <p>Loading..</p>;
  }

  if (session.status === "unauthenticated" || session.data?.user.profile) {
    router.push(redirectUrl ?? "/").catch(() => 0);
    return null;
  }

  return (
    <div className="m-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex flex-wrap items-center">
          <div>
            <p className="mb-2 text-xl text-muted-foreground">Almost There!</p>
            <h1 className="mb-4 text-4xl font-bold">
              Let&apos;s Complete Your Profile
            </h1>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="ml-auto whitespace-nowrap"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            Nevermind, Sign Out
          </Button>
        </div>

        <hr className="mb-8 mt-4" />

        <TsForm
          schema={completeSignUpSchema}
          onSubmit={onSubmit}
          renderAfter={() => (
            <Button
              className="mt-4"
              type="submit"
              isLoading={completeSignUp.isLoading}
            >
              Create Profile
            </Button>
          )}
        />
      </div>
    </div>
  );
};

export default CompleteSignUp;
