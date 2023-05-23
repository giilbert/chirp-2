import {
  BellIcon,
  BookmarkIcon,
  HashIcon,
  HomeIcon,
  ListIcon,
  TicketIcon,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

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
  return (
    <nav className="col-span-1 border-r px-12 pt-4 2xl:pt-12">
      <div className="ml-5 text-3xl font-extrabold">Logo</div>

      <div className="mt-4 flex flex-col">
        {links.map(({ name, href, Icon }) => (
          <Link
            href={href}
            key={name}
            className="flex items-center gap-4 rounded-full py-3 pl-5 pr-6 text-2xl transition-colors hover:bg-gray-700/20"
          >
            <Icon />
            {name}
          </Link>
        ))}

        <Button size="lg" className="ml-5 mt-2 text-xl font-bold">
          Chirp
        </Button>
      </div>
    </nav>
  );
};
