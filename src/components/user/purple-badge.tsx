import { BadgeDollarSignIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const PurpleBadge: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <BadgeDollarSignIcon className="text-purple-500" />
        </TooltipTrigger>

        <TooltipContent>Chirp Purple Subscriber</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
