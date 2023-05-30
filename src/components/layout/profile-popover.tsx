import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const ProfilePopover: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent>
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => void signOut({ callbackUrl: "/" })}
        >
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
};
