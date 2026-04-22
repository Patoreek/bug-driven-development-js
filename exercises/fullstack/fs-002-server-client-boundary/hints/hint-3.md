# Hint 3 (Strong)

1. Add `"use client"` as the very first line of `LikeButton.tsx`
2. Remove `onLike` from the props type and component. The like logic should live entirely inside the client component.
3. In `UserProfile.tsx`, stop creating and passing the `handleLike` function. Just pass `userId` (a string -- serializable).
