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
    <>
      <div className="flex justify-center">
        <div className="flex w-screen lg:grid lg:max-w-[150rem] lg:grid-cols-4">
          <div className="min-w-[54px] lg:col-span-1" />
          <div className="z-10 col-span-2 w-full">{children}</div>
          <div className="hidden h-full w-[32rem] border-l md:block lg:w-full"></div>
        </div>
      </div>

      <div className="fixed left-0 top-0 flex w-screen justify-center">
        <div className="flex h-screen w-screen lg:grid lg:max-w-[150rem] lg:grid-cols-4">
          <Nav />
        </div>
      </div>
    </>
  );
};
