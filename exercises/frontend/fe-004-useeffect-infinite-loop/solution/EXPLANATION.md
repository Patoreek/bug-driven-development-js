# Solution: useEffect Infinite Loop

## The Bug

The `fetchConfig` object is created in the component body on every render:

```tsx
const fetchConfig = { userId, includeRole };

useEffect(() => {
  fetchUser(fetchConfig).then(/* ... */);
}, [fetchConfig]); // new reference every render!
```

Since JavaScript objects are compared by reference (`{} !== {}`), React sees `fetchConfig` as a new value each render, re-runs the effect, which calls `setUser`/`setLoading`, which triggers another render, creating an infinite loop.

## The Fix

Move the object creation inside the effect and use primitive values in the dependency array:

```tsx
useEffect(() => {
  fetchUser({ userId, includeRole }).then(/* ... */);
}, [userId, includeRole]); // primitives compare by value
```

Primitive values (numbers, booleans, strings) are compared by value, so the effect only re-runs when `userId` or `includeRole` actually changes.

## Key Takeaway

Never put objects, arrays, or functions created during render into a `useEffect` dependency array. Either use the primitive values that make up the object, or memoize the object with `useMemo`. This is one of the most common React bugs.
