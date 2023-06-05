import type { AppRouter } from "@/server/api/root";
import type { TRPCClientErrorLike } from "@trpc/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export const ErrorMessage: React.FC<{
  error: TRPCClientErrorLike<AppRouter>;
}> = ({ error }) => {
  return (
    <div className="m-2 rounded bg-red-500/80 p-4 pb-0">
      <p className="text-xl">Uh oh! An error occured during data fetching.</p>
      <p className="font-mono">Code: {error.data?.code}</p>
      <p className="font-mono">Message: {error.message}</p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="stack" className="border-none">
          <AccordionTrigger>View Stack</AccordionTrigger>
          <AccordionContent>
            <p className="font-mono">{error.data?.stack}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
