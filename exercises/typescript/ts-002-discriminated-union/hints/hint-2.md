# Hint 2 (Medium)

A discriminated union uses a shared property with literal types as the "discriminant":

```ts
type Notification =
  | { type: "info"; title: string; message: string }
  | { type: "error"; title: string; message: string; errorCode: number }
  // ... more variants
```

When you `switch` on `notification.type`, TypeScript automatically narrows the type in each `case` branch, giving you access to only the fields that exist for that variant.

For exhaustive checking, add a `default` case that assigns to `never` -- this causes a compile error if you add a new variant without handling it.
