# Server-Client Boundary: Missing 'use client' and Non-Serializable Props

**ID:** `fs-002-server-client-boundary`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `nextjs`, `server-components`, `client-components`, `use-client`, `serialization`  
**Prerequisites:** None

---

## The Scenario

You're building a user profile page in Next.js. The page is a server component that fetches user data and renders a `UserProfile` component, which includes a `LikeButton` for favoriting the user. The `LikeButton` uses React hooks (`useState`) to manage its state. After deploying, the page crashes with an error about hooks not being allowed in server components. A teammate tries to fix it by passing a callback function as a prop from the server component, which introduces a second bug.

## The Bug

Two problems exist:
1. `LikeButton` uses `useState` but is missing the `"use client"` directive, so Next.js treats it as a server component where hooks are illegal.
2. `UserProfile` (a server component) passes a function prop (`onLike`) to `LikeButton`. Functions are not serializable and cannot cross the server-client boundary.

## Your Task

1. Add the `"use client"` directive to the component that needs it
2. Restructure the components so no non-serializable props cross the server-client boundary
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/UserProfile.tsx` | Server component rendering profile and like button |
| `src/LikeButton.tsx` | Interactive button component missing client directive |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) -- rendering model
- [use client directive](https://react.dev/reference/rsc/use-client) -- marking client boundaries
- [Passing Props](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns) -- serialization constraints
