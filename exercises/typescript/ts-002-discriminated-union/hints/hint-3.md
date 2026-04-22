# Hint 3 (Strong)

Define the union type and an exhaustive helper:

```ts
type Notification =
  | { type: "info"; title: string; message: string }
  | { type: "error"; title: string; message: string; errorCode: number }
  | { type: "progress"; title: string; progress: number; total: number }
  | { type: "link"; title: string; href: string };

function assertNever(value: never): never {
  throw new Error(`Unhandled type: ${(value as any).type}`);
}
```

Then use a `switch` in `formatNotification`:

```ts
switch (notification.type) {
  case "info": return `... ${notification.message}`;
  case "error": return `... ${notification.errorCode}`;
  // ...
  default: return assertNever(notification);
}
```

For `createNotification`, use function overloads so each `type` requires its specific extra fields.
