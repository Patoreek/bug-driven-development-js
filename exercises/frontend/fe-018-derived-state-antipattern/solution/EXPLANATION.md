# Solution: Derived State Anti-pattern

## The Problem

The component copied prop-derived values into state and synced them with `useEffect`:

```tsx
const [fullName, setFullName] = useState("");
const [initials, setInitials] = useState("");
// ...

useEffect(() => {
  setFullName(`${user.firstName} ${user.lastName}`);
  setInitials(...);
  // ...
}, [user]);
```

This creates two problems:

1. **Stale first render** — When props change, the component renders once with old state values, then `useEffect` fires after that render, updating state and causing a second render. Users see a flicker of stale data.

2. **Unnecessary complexity** — State that's purely derived from props doesn't need to be stored in state at all. It adds useEffect, useState, and sync logic for no benefit.

## The Fix

Compute values directly from props during render:

```tsx
export function UserProfile({ user }: UserProfileProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const emailDomain = user.email.split("@")[1] || "";
  const accountAge = computeAccountAge(user.joinedAt);

  return (/* ... */);
}
```

No `useState`, no `useEffect`. The values are always in sync with the current props, with zero render delay.

## When to Use This Pattern

- **Compute during render** if the derivation is simple (string concatenation, formatting, filtering)
- **Use `useMemo`** if the derivation is expensive (sorting large arrays, complex calculations)
- **Only use `useState` + `useEffect`** when you need truly independent local state that just happens to be initialized from a prop (e.g., a form editing a copy of the data)

## Key Takeaway

If a value can be computed from existing props or state, it's not state — it's a derived value. Just compute it during render. This eliminates an entire class of bugs related to state synchronization.
