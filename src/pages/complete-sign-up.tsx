import { Button } from "@/components/ui/button";
import { TsForm } from "@/components/ui/forms";
import { completeSignUpSchema } from "@/lib/schemas/user";
import type { NextPage } from "next";

const CompleteSignUp: NextPage = () => {
  return (
    <div className="m-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">Complete Sign Up</h1>
        <hr className="my-8" />

        <TsForm
          schema={completeSignUpSchema}
          onSubmit={console.log}
          renderAfter={() => <Button className="mt-4">Create Profile</Button>}
        />
      </div>
    </div>
  );
};

export default CompleteSignUp;
