# Hint 3 (Strong)

Replace the entire `useEffect + useState` pattern with a single line:

```tsx
const theme = useSyncExternalStore(
  themeStore.subscribe,
  themeStore.getTheme,
  themeStore.getTheme  // SSR fallback
);
```

Remove the `useState`, `useEffect`, and the manual `setTheme` calls. The hook handles all subscription management and ensures the value is read consistently during render. Apply the same fix to `ThemeBadge`.
