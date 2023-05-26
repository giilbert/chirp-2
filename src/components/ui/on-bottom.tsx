import type { PropsWithChildren } from "react";
import { useInView } from "react-intersection-observer";

export const OnBottom: React.FC<
  PropsWithChildren<{ onBottom: () => void }>
> = ({ children, onBottom }) => {
  const { ref, inView } = useInView();

  if (inView) onBottom();

  return (
    <div>
      {children}
      <div ref={ref} className="h-0.5 w-0.5" />
    </div>
  );
};
