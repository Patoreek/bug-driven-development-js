# Hint 3 (Strong)

Replace `&` first (to avoid double-encoding), then the rest:

```ts
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

Then wrap every user-provided value in the template literals with `escapeHtml(...)`:
```ts
<h2>${escapeHtml(user.name)}</h2>
```
