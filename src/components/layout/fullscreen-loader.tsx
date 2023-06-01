import { Logo } from "./logo";

export const FullscreenLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-24">
        <Logo />
      </div>
    </div>
  );
};
