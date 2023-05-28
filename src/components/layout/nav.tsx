import {
  BellIcon,
  BookmarkIcon,
  FileQuestionIcon,
  HashIcon,
  HomeIcon,
  ListIcon,
  MoreHorizontalIcon,
  PenToolIcon,
  TicketIcon,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const Nav: React.FC = () => {
  const { data: session, status } = useSession();

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
      href: "/" + (session?.user.profile?.username ?? ""),
      Icon: UserCircle,
    },
  ] as const;

  return (
    <nav className="col-span-1 flex h-screen w-[54px] flex-col items-start border-r pt-4 lg:w-full 2xl:pt-8">
      <div>
        <div className="ml-4 w-min text-3xl font-extrabold lg:ml-8">
          <FileQuestionIcon />
        </div>

        <div className="mx-1 mt-4 flex flex-col lg:mx-4">
          {links.map(({ name, href, Icon }) => (
            <Link
              href={href}
              key={name}
              className="flex w-min items-center gap-4 whitespace-nowrap rounded-full p-3 text-2xl transition-colors hover:bg-gray-700/20 lg:py-3 lg:pl-4 lg:pr-6"
            >
              <Icon />
              <span className="hidden lg:block">{name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full px-8">
        <Button className="mt-4 hidden w-full text-xl font-bold lg:block">
          Chirp
        </Button>
      </div>

      <Button className="ml-1 mt-2 flex h-[46.5px] w-[46.5px] items-center justify-center rounded-full p-0 lg:hidden">
        <PenToolIcon size={20} />
      </Button>

      <div className="mt-auto hidden w-full p-4 lg:block">
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
