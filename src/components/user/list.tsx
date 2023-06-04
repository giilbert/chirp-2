import type { EverythingUser } from "@/server/api/routers/user";
import { UserCard } from "./card";

export const UserList: React.FC<{
  users: EverythingUser[];
}> = ({ users }) => {
  return (
    <>
      {users.map((user) => (
        <UserCard key={user.userId} user={user} />
      ))}
    </>
  );
};
