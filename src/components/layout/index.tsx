import { PropsWithChildren } from "react";
import { Nav } from "./nav";

export const Layout: React.FC<
  PropsWithChildren<{
    title?: string;
  }>
> = ({ title = "Chirp", children }) => {
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
