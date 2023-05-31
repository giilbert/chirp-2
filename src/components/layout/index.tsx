import { useSession } from "next-auth/react";
import { Nav } from "./nav";
import { useRouter } from "next/router";
import { FullscreenLoader } from "./fullscreen-loader";

export const Layout: React.FC<
  React.PropsWithChildren<{
    title?: string;
  }>
> = ({ title: _title = "Chirp", children }) => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return <FullscreenLoader />;
  }

  if (session.data && !session.data.user.profile) {
    router.push("/complete-sign-up").catch(() => 0);
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="flex w-screen lg:grid lg:max-w-[150rem] lg:grid-cols-4">
          <div className="min-w-[54px] lg:col-span-1">
            {/* the progress bar has some issues, this is here to cover those issues */}
            <div className="sticky left-0 top-0 z-10 h-2 w-full border-r bg-background backdrop-blur-sm" />
          </div>
          <div className="z-10 col-span-2 w-full">{children}</div>
          <div className="hidden h-full w-[32rem] border-l md:block lg:w-full">
            {/* see comment above */}
            <div className="sticky left-0 top-0 z-10 h-2 w-full border-l bg-background backdrop-blur-sm" />
          </div>
        </div>
      </div>

      <div className="fixed left-0 top-0 flex w-screen justify-center">
        <div className="flex h-screen w-screen lg:grid lg:max-w-[150rem] lg:grid-cols-4">
          <Nav />
          <div className="col-span-2 w-full" />
          <div className="hidden h-full w-[32rem] md:block lg:w-full"></div>
        </div>
      </div>
    </>
  );
};
