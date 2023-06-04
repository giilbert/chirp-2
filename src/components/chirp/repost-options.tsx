import { RepeatIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { api } from "@/utils/api";
import type { EverythingChirpWithoutNesting } from "@/server/api/routers/chirp";
import { useToast } from "@/lib/use-toast";

export const ChirpRepostOptions: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  chirp: EverythingChirpWithoutNesting;
}> = ({ children, disabled, chirp }) => {
  const { toast } = useToast();
  const rechirp = api.chirp.rechirp.useMutation({
    onSuccess() {
      toast({
        title: "Rechirped!",
        description: "Your rechirp has been posted.",
      });
    },
    onError() {
      toast({
        title: "Error",
        description: "There was an error rechirping this chirp.",
        variant: "destructive",
      });
    },
  });
  // const quote = api.chirp.quote.useMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Repost Options</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            rechirp
              .mutateAsync({
                chirpId: chirp.id,
              })
              .catch(console.error);
          }}
        >
          <RepeatIcon size={16} className="mr-2" />
          Rechirp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
