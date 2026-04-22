# Hint 3 (Strong)

Remove the `fetchConfig` variable. Create the config object inside the effect, and use `[userId, includeRole]` as the dependency array instead:

```tsx
useEffect(() => {
  fetchUser({ userId, includeRole }).then(/* ... */);
}, [userId, includeRole]);
```
