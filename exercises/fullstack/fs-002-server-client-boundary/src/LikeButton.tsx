// BUG: Missing "use client" directive -- this component uses hooks
// but Next.js will treat it as a server component

import { useState } from "react";

type LikeButtonProps = {
  userId: string;
  onLike: () => void;
};

export function LikeButton({ userId, onLike }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike();
  };

  return (
    <button
      data-testid="like-button"
      onClick={handleClick}
      aria-pressed={liked}
    >
      {liked ? "Unlike" : "Like"} ({count})
    </button>
  );
}
