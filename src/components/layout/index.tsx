import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import { Nav } from "./nav";
import { useRouter } from "next/router";

export const Layout: React.FC<
  PropsWithChildren<{
    title?: string;
  }>
> = ({ title = "Chirp", children }) => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    // TODO: loading state
    return <p>Loading</p>;
  }

  if (session.data && !session.data.user.profile) {
    router.push("/complete-sign-up").catch(() => 0);
  }

  return (
    <div className="flex justify-center">
      <div className="grid h-screen w-screen max-w-[150rem] grid-cols-4">
        <Nav />
        <div className="col-span-2">{children}</div>
        <div className="border-l"></div>
      </div>
    </div>
  );
};
