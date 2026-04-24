# Solution: Concurrent Features — Misplaced Transitions

## Why the Bug Happens

React's `startTransition` marks state updates as **non-urgent**, meaning React can defer them, interrupt them, or batch them to keep the UI responsive. The bug puts the *wrong* update inside the transition:

```tsx
// BUGGY: The text input state is deferred — typing feels laggy
const handleChange = (e) => {
  startTransition(() => {
    setQuery(e.target.value);  // This is the ONLY state, and it's deferred
  });
};
```

Because the input's `value` prop is bound to `query`, and `query` updates are deferred, the user types a character but doesn't see it reflected until React finishes the transition. Meanwhile, `useMemo` runs the expensive filter on `query` at full priority.

## The Fix

Separate urgent state (input value) from deferred state (filter query):

```tsx
// FIXED
const [query, setQuery] = useState("");
const [deferredQuery, setDeferredQuery] = useState("");
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  setQuery(e.target.value);           // URGENT — input updates instantly
  startTransition(() => {
    setDeferredQuery(e.target.value);  // DEFERRED — filter can lag behind
  });
};

// Expensive computation now depends on the deferred value
const filteredItems = useMemo(
  () => computeExpensiveFilteredList(ALL_ITEMS, deferredQuery),
  [deferredQuery]
);
```

## Alternative Approach

You can also use `useDeferredValue` which achieves the same effect with less code:

```tsx
const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);

const handleChange = (e) => setQuery(e.target.value);

const filteredItems = useMemo(
  () => computeExpensiveFilteredList(ALL_ITEMS, deferredQuery),
  [deferredQuery]
);
```

## Key Takeaway

`startTransition` and `useDeferredValue` should wrap the **expensive, non-urgent** work, never the urgent user feedback. The input that the user is actively interacting with must always update at urgent priority.

## Documentation

- [useTransition](https://react.dev/reference/react/useTransition)
- [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [Transitions in React 18+](https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions)

## Interview Context

This tests understanding of React's concurrent rendering model. Interviewers look for:
- Knowing the difference between urgent and transition updates
- Understanding that `startTransition` defers state, not computation
- Recognizing when to split state into urgent vs deferred parts
- Familiarity with `useDeferredValue` as an alternative
