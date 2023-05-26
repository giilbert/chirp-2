import { User } from "next-auth";
import { useSession } from "next-auth/react";

/// Renders its children if the user is currently signed in
export const Authed: React.FC<{
  loading?: React.ReactNode;
  children: React.ReactNode | ((user: User) => React.ReactNode);
}> = ({ loading, children }) => {
  const session = useSession();

  if (session.status === "loading") {
    return <>{loading}</>;
  }

  if (session.status === "unauthenticated") {
    return null;
  }

  if (session.status === "authenticated")
    return (
      <>
        {typeof children === "function"
          ? children(session.data?.user)
          : children}
      </>
    );

  return null;
};
