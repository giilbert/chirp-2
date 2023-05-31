import { api } from "@/utils/api";
import { useAnimate } from "framer-motion";
import { HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";

export const LikeButton: React.FC<{
  chirpId: string;
  numbered: boolean;
  setLikes: (n: number) => void;
  likes: number;
  hasLiked: boolean;
}> = ({ chirpId, numbered, setLikes, likes, hasLiked }) => {
  const { status: sessionStatus } = useSession();
  const likeChirp = api.chirp.likeChirp.useMutation();
  const unlikeChirp = api.chirp.unlikeChirp.useMutation();
  const [scope, animate] = useAnimate();
  const [liked, setLiked] = useState(hasLiked);
  const initialStyles = liked
    ? {
        stroke: "#ef4444",
        fill: "#ef4444",
      }
    : undefined;

  const like = useCallback(async () => {
    // TODO: throttle maybe?
    setLikes(likes + 1);
    await animate("svg", { scale: 0, stroke: "#ef4444" }, { duration: 0.1 });
    await animate(
      "svg",
      { scale: 1, fill: "#ef4444" },
      {
        ease: [0.76, 0, 0.51, 1.58],
        duration: 0.2,
        fill: {
          duration: 0,
        },
      }
    );
    await likeChirp.mutateAsync({ chirpId });
  }, [animate, likeChirp, chirpId, setLikes, likes]);

  const unlike = useCallback(async () => {
    // TODO: throttle maybe?
    setLikes(likes - 1);
    await animate("svg", { scale: 0, stroke: "#73839a" }, { duration: 0.1 });
    await animate(
      "svg",
      { scale: 1, fill: "#00000000" },
      {
        ease: [0.76, 0, 0.51, 1.58],
        duration: 0.2,
        fill: {
          duration: 0,
        },
      }
    );
    await unlikeChirp.mutateAsync({ chirpId });
  }, [animate, unlikeChirp, chirpId, setLikes, likes]);

  const buttonAction = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (sessionStatus !== "authenticated") return;

      if (liked) {
        unlike().catch(() => 0);
        setLiked(false);
      } else {
        like().catch(() => 0);
        setLiked(true);
      }
    },
    [like, unlike, liked, sessionStatus]
  );

  if (numbered) {
    return (
      <div className="group flex cursor-pointer items-center gap-1 transition-colors hover:text-red-500">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:bg-red-600/10"
          onClick={buttonAction}
          ref={scope}
        >
          <HeartIcon
            size={18}
            className="transition-colors"
            style={initialStyles}
          />
        </div>
        <p className="text-sm transition-colors">{likes}</p>
      </div>
    );
  }

  return (
    <div
      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-600/10 hover:text-red-500"
      onClick={buttonAction}
      ref={scope}
    >
      <HeartIcon
        size={20}
        className="transition-colors"
        style={initialStyles}
      />
    </div>
  );
};
