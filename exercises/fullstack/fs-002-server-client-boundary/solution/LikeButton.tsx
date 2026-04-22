"use client";

import { useState } from "react";

type LikeButtonProps = {
  userId: string;
};

export function LikeButton({ userId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
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
