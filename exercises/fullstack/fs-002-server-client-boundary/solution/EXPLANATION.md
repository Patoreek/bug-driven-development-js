# Solution: Server-Client Boundary

## The Bug

Two issues at the server-client boundary:

1. **Missing `"use client"` directive:** `LikeButton` uses `useState` (a React hook), but without the `"use client"` directive, Next.js treats it as a server component. Hooks are not allowed in server components.

2. **Non-serializable prop:** `UserProfile` (a server component) passes `onLike` -- a function -- as a prop to `LikeButton`. Props that cross the server-client boundary must be serializable (strings, numbers, booleans, arrays, plain objects). Functions, class instances, and Dates are not serializable.

## The Fix

1. Add `"use client"` at the top of `LikeButton.tsx`:
```tsx
"use client";
```

2. Remove the `onLike` function prop. Move the like logic entirely into the client component:
```tsx
type LikeButtonProps = {
  userId: string; // serializable -- safe to pass from server
};
```

3. Remove the function creation from `UserProfile`:
```tsx
<LikeButton userId={user.id} />
```

## Key Takeaway

The `"use client"` directive marks the boundary where server rendering ends and client interactivity begins. Any component using hooks, event handlers, or browser APIs needs this directive. Props crossing this boundary must be JSON-serializable -- no functions, class instances, or Symbols.
