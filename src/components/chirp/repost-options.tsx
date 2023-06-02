import { PencilIcon, RepeatIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { api } from "@/utils/api";
import { EverythingChirpWithoutNesting } from "@/server/api/routers/chirp";

export const ChirpRepostOptions: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  chirp: EverythingChirpWithoutNesting;
}> = ({ children, disabled, chirp }) => {
  const rechirp = api.chirp.rechirp.useMutation();
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
              .then(() => {
                // TODO: toast
                console.log("chirp rechirped");
              })
              .catch(console.error);
          }}
        >
          <RepeatIcon size={16} className="mr-2" />
          Rechirp
        </DropdownMenuItem>
        <p className="m-2 text-sm">More coming soon!</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
