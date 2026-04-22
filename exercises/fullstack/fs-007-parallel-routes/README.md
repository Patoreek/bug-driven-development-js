# Parallel Routes: Missing Default Slots and State Handling

**ID:** `fs-007-parallel-routes`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `nextjs`, `parallel-routes`, `layout`, `error-handling`, `loading-states`  
**Prerequisites:** None

---

## The Scenario

You are building an admin dashboard that uses Next.js parallel routes. The layout has multiple named slots (`@team`, `@analytics`) that render independent content side by side. After shipping, the app crashes when navigating to a route that does not define all slots. Additionally, slots that are in a loading or error state always show their final content instead of appropriate fallback UI.

## The Bug

Three issues exist in the layout router:
1. `renderLayout` renders raw `slot.content` without checking for loading or error states
2. `resolveSlot` ignores the `loading` and `error` properties entirely
3. `getSlotContent` crashes with a TypeError when accessing a slot that does not exist in the config

## Your Task

1. Fix `resolveSlot` to return `error` (highest priority), then `loading`, then `content`
2. Fix `getSlotContent` to return an empty string for missing slots instead of crashing
3. Fix `renderLayout` to use `resolveSlot` for each slot
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/layoutRouter.ts` | Layout router with broken slot resolution |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes) -- rendering multiple pages simultaneously
- [default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default) -- fallback for unmatched parallel routes
- [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) -- streaming and loading states
