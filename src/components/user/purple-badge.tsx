import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { BadgeCheckIcon } from "lucide-react";

export const PurpleBadge: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <BadgeCheckIcon className="text-purple-500" />
        </TooltipTrigger>

        <TooltipContent>Chirp Purple Member</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
