import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const ChirpProfilePicture: React.FC<{
  image: string | null;
  displayName: string;
}> = ({ image, displayName }) => {
  return (
    <Avatar className="h-12 w-12 rounded-full">
      <AvatarImage src={image || undefined} />
      <AvatarFallback className="text-2xl lg:text-6xl">
        {displayName
          .split(" ")
          .map((w) => w[0]?.toUpperCase())
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};
