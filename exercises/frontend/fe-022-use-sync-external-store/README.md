# External Store Tearing with useEffect

**ID:** `fe-022-use-sync-external-store`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `react`, `useSyncExternalStore`, `external-store`, `tearing`, `concurrent`  
**Prerequisites:** None

---

## The Scenario

Your team manages a design system with a global theme store -- a simple pub/sub object outside React. The `ThemeDisplay` component subscribes to it using the classic `useEffect + useState` pattern. QA reports that occasionally, after toggling the theme, different parts of the UI briefly show different themes (one component shows "dark" while another still shows "light"). This is called **tearing** and it happens because the subscription pattern is incompatible with React's concurrent rendering.

## The Bug

The component subscribes to an external store using `useEffect` + `useState`. This has two problems:

1. **Tearing:** During concurrent renders, the component can read a stale snapshot because `useEffect` runs *after* render, not during it. Two components reading the same store can render with different values.
2. **Mount-time race:** Between `useState(store.getTheme())` and the `useEffect` subscription firing, the store can change, and the component misses that update on first render.

## Your Task

1. Examine `src/ThemeDisplay.tsx` and `src/ThemeStore.ts`
2. Replace the `useEffect + useState` subscription pattern with the correct React API for external stores
3. Ensure both `ThemeDisplay` and `ThemeBadge` use the same fix
4. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/ThemeDisplay.tsx` | Components subscribing to the theme store |
| `src/ThemeStore.ts` | External theme store (may or may not need changes) |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore) -- the official API for external stores
- [Tearing in concurrent React](https://github.com/reactwg/react-18/discussions/69) -- React 18 working group discussion
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) -- when useEffect is the wrong tool
