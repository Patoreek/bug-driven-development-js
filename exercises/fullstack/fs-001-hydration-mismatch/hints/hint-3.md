# Hint 3 (Strong)

Initialize state with safe defaults (e.g., `null` for greeting, `"full"` for layout), then use `useEffect` to set the real client values after hydration:

```tsx
const [greeting, setGreeting] = useState<string | null>(null);
useEffect(() => {
  setGreeting(getTimeOfDayGreeting());
}, []);
```

`useEffect` only runs on the client, after the component mounts.
