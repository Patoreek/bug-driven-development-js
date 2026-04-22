# Hint 3 (Strong)

Create a helper to check if something is a plain object:

```ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
```

Then in each parse function, validate step by step:

```ts
export function parseUserResponse(raw: unknown): ApiResponse<User> {
  if (!isRecord(raw)) throw new Error("Expected response object");
  if (!isRecord(raw.data)) throw new Error("Expected data object");
  // Check typeof raw.data.id === "number", etc.
  // Check role is one of "admin" | "editor" | "viewer"
}
```

Throw an error for every invalid case rather than silently returning bad data.
