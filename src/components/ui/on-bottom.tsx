import type { PropsWithChildren } from "react";
import { useInView } from "react-intersection-observer";

export const OnBottom: React.FC<
  PropsWithChildren<{ onBottom: () => void }>
> = ({ children, onBottom }) => {
  const { ref, inView } = useInView({
    delay: 1000,
  });

  if (inView) onBottom();

  return (
    <div>
      {children}
      <div ref={ref} className="relative -top-80 h-0.5 w-0.5" />
    </div>
  );
};
