# Hint 3 (Strong)

Move all hooks (`useState`, `useEffect`) to the top of the component, before any conditions. Then put the conditional logic inside the `useEffect` callback:
```tsx
const [visitCount, setVisitCount] = useState(0);
const [greeting, setGreeting] = useState("");

useEffect(() => {
  if (isLoggedIn) {
    setVisitCount((prev) => prev + 1);
    setGreeting(`Good ${getTimeOfDay()}, ${username}!`);
  }
}, [isLoggedIn, username]);
```
Use `if (!isLoggedIn)` for the early return after all hooks have been called.
