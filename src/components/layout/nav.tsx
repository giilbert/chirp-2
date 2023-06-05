import {
  ArrowRightSquareIcon,
  // BellIcon,
  // BookmarkIcon,
  // HashIcon,
  HomeIcon,
  // ListIcon,
  MoreHorizontalIcon,
  PenToolIcon,
  SearchIcon,
  TicketIcon,
  // TicketIcon,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { signIn, useSession } from "next-auth/react";
import { ProfilePopover } from "./profile-popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { CreateChirpDialog } from "../chirp/dialog";
import { Logo } from "./logo";

export const Nav: React.FC = () => {
  const { data: session, status } = useSession();

  const links = [
    {
      name: "Home",
      href: "/",
      Icon: HomeIcon,
    },
    // {
    //   name: "Explore",
    //   href: "/explore",
    //   Icon: HashIcon,
    // },
    // {
    //   name: "Notifications",
    //   href: "/notifications",
    //   Icon: BellIcon,
    // },
    // {
    //   name: "Lists",
    //   href: "/lists",
    //   Icon: ListIcon,
    // },
    // {
    //   name: "Bookmarks",
    //   href: "/bookmarks",
    //   Icon: BookmarkIcon,
    // },
    {
      name: "Search",
      href: "/search",
      Icon: SearchIcon,
    },
    {
      name: "Chirp Purple",
      href: "/purple",
      Icon: TicketIcon,
    },
    status === "authenticated" && {
      name: "Profile",
      href: "/" + (session?.user.profile?.username ?? ""),
      Icon: UserCircle,
    },
  ] as const;

  return (
    <nav className="col-span-1 flex h-screen w-[54px] flex-col items-start border-r pt-4 lg:w-full 2xl:pt-8">
      <div>
        <div className="ml-3.5 mt-1 h-[32px] w-[32px] text-3xl font-extrabold lg:ml-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="mx-1 mt-4 flex flex-col gap-1 lg:mx-4">
          {links.map(
            (item) =>
              item && (
                <Link
                  href={item.href}
                  key={item.name}
                  className="flex w-min items-center gap-4 whitespace-nowrap rounded-full p-3 text-2xl transition-colors hover:bg-gray-700/20 lg:py-3 lg:pl-4 lg:pr-6"
                >
                  <item.Icon />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              )
          )}
        </div>
      </div>

      {status === "authenticated" && (
        <>
          <div className="w-full px-8">
            <CreateChirpDialog>
              <Button className="mt-4 hidden w-full text-xl font-bold lg:block">
                Chirp
              </Button>
            </CreateChirpDialog>
          </div>
          <CreateChirpDialog>
            <Button className="ml-1 mt-2 flex h-[46.5px] w-[46.5px] items-center justify-center rounded-full p-0 lg:hidden">
              <PenToolIcon size={20} />
            </Button>
          </CreateChirpDialog>
        </>
      )}

      <div className="mb-1 mt-auto lg:hidden">
        {status === "unauthenticated" ? (
          <Button
            className="ml-1 mt-2 flex h-[46.5px] w-[46.5px] items-center justify-center rounded-full p-0 lg:hidden"
            variant="secondary"
            onClick={() => {
              const params = new URLSearchParams();
              params.append("redirect", window.location.href);

              void signIn("google", {
                callbackUrl: "/complete-sign-up?" + params.toString(),
              });
            }}
          >
            <ArrowRightSquareIcon size={20} />
          </Button>
        ) : (
          <ProfilePopover>
            <Avatar className="mb-1 ml-1 h-[46.5px] w-[46.5px] cursor-pointer">
              <AvatarImage src={session?.user.image} />
            </Avatar>
          </ProfilePopover>
        )}
      </div>

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
          <ProfilePopover>
            <div className="flex cursor-pointer items-center gap-4 rounded-full py-2 pl-4 pr-6 transition-colors hover:bg-muted">
              <Avatar className="mb-1 ml-1 h-[40px] w-[40px] cursor-pointer">
                <AvatarImage src={session?.user.image} />
              </Avatar>

              <div>
                <p className="font-bold">
                  {session.user.profile?.displayName || ""}
                </p>
                {session.user.profile && (
                  <p className="-mt-1 text-muted-foreground">
                    @{session.user.profile.username}
                  </p>
                )}
              </div>

              <MoreHorizontalIcon className="ml-auto" />
            </div>
          </ProfilePopover>
        )}
      </div>
    </nav>
  );
};
