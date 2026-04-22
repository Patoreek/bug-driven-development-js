# Solution: Conditional Hook Call

## The Bug

Hooks are called inside an `if (isLoggedIn)` block:

```tsx
if (isLoggedIn) {
  const [visitCount, setVisitCount] = useState(0);  // conditional!
  const [greeting, setGreeting] = useState("");       // conditional!
  useEffect(() => { ... }, [username]);               // conditional!
  return ( ... );
}
```

React tracks hooks by their call order (1st hook, 2nd hook, etc.), not by name. When `isLoggedIn` changes from `true` to `false`, the hooks stop being called. When it changes back to `true`, React associates the hooks with the wrong internal state slots, causing crashes or corrupted state.

## The Fix

Move all hooks to the top of the component (before any conditions), and put the conditional logic inside the hooks/JSX:

```tsx
export function UserGreeting({ isLoggedIn, username }: UserGreetingProps) {
  const [visitCount, setVisitCount] = useState(0);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      setVisitCount((prev) => prev + 1);
      setGreeting(`Good ${getTimeOfDay()}, ${username}!`);
    }
  }, [isLoggedIn, username]);

  if (!isLoggedIn) {
    return <div data-testid="login-prompt">...</div>;
  }

  return <div data-testid="greeting-container">...</div>;
}
```

## Key Takeaway

The #1 rule of React hooks: **Hooks must be called at the top level of the component, in the same order, every render.** Never put hooks inside `if`, `for`, `while`, or after early returns. Move the conditional logic inside the hook (e.g., inside the `useEffect` callback) instead.
