import {
  BellIcon,
  BookmarkIcon,
  HashIcon,
  HomeIcon,
  ListIcon,
  MoreHorizontalIcon,
  TicketIcon,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const links = [
  {
    name: "Home",
    href: "/",
    Icon: HomeIcon,
  },
  {
    name: "Explore",
    href: "/explore",
    Icon: HashIcon,
  },
  {
    name: "Notifications",
    href: "/notifications",
    Icon: BellIcon,
  },
  {
    name: "Lists",
    href: "/lists",
    Icon: ListIcon,
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    Icon: BookmarkIcon,
  },
  {
    name: "Chirp Blue",
    href: "/blue",
    Icon: TicketIcon,
  },
  {
    name: "Profile",
    href: "/profile",
    Icon: UserCircle,
  },
] as const;

export const Nav: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="flex h-screen flex-col items-start border-r pt-4 2xl:pt-12">
      <div className="w-full">
        <div className="ml-8 text-3xl font-extrabold">Logo</div>

        <div className="mx-4 mt-4 flex flex-col">
          {links.map(({ name, href, Icon }) => (
            <Link
              href={href}
              key={name}
              className="flex w-min items-center gap-4 whitespace-nowrap rounded-full py-3 pl-4 pr-6 text-2xl transition-colors hover:bg-gray-700/20"
            >
              <Icon />
              {name}
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full px-8">
        <Button className="mt-4 w-full text-xl font-bold">Chirp</Button>
      </div>

      <div className="mt-auto w-full p-4">
        {status === "unauthenticated" && (
          <div className="px-4">
            <Button
              size="lg"
              className="w-full text-xl"
              variant="secondary"
              onClick={() => {
                const params = new URLSearchParams();
                params.append("redirect", window.location.href);

                void signIn("google", {
                  callbackUrl: "/complete-sign-up?" + params.toString(),
                });
              }}
            >
              Sign in
            </Button>
          </div>
        )}
        {status === "authenticated" && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex cursor-pointer items-center gap-4 rounded-full py-2 pl-4 pr-6 transition-colors hover:bg-muted">
                <div className="h-[40px] w-[40px] rounded-full bg-secondary-foreground" />

                <div>
                  <p className="font-bold">{session.user.name}</p>
                  {session.user.profile && (
                    <p className="-mt-1 text-muted-foreground">
                      @{session.user.profile.username}
                    </p>
                  )}
                </div>

                <MoreHorizontalIcon className="ml-auto" />
              </div>
            </PopoverTrigger>

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
        )}
      </div>
    </nav>
  );
};
