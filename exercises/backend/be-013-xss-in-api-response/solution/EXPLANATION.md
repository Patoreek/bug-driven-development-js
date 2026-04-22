# Solution: XSS in API Response

## The Bug

The `escapeHtml` function was a no-op -- it returned the input string without any modification:

```ts
export function escapeHtml(str: string): string {
  return str; // Does nothing!
}
```

Even worse, the rendering functions (`renderUserCard`, `renderSearchResults`) didn't call `escapeHtml` at all. They interpolated user input directly into HTML template literals, allowing any HTML or JavaScript in user-provided fields to be rendered as-is.

## The Fix

1. **Implemented `escapeHtml`** to encode the five critical HTML characters:
```ts
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")   // Must be first to avoid double-encoding
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

2. **Applied `escapeHtml` to every user-provided value** before inserting it into HTML:
```ts
<h2>${escapeHtml(user.name)}</h2>
<p class="bio">${escapeHtml(user.bio)}</p>
<a href="${escapeHtml(user.website)}">Website</a>
```

The order of replacements matters: `&` must be replaced first, otherwise `&lt;` from a previous replacement could become `&amp;lt;`.

## Key Takeaway

Never trust user input. Any value that originated from a user and is placed into HTML must be escaped. This applies to element content, attribute values, and anywhere else user data meets HTML. The rule is simple: **encode on output**, every time, regardless of whether you think the input is "safe."
