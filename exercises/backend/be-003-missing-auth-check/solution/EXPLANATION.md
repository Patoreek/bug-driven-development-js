# Explanation: Missing Authorization Check

## The Bug

The handler only checked **authentication** (is the user logged in?) but skipped **authorization** (does the user have permission?). Any authenticated user — including viewers — could delete any article:

```ts
// Only checks the token exists and is valid
const user = getUserFromToken(ctx.token);
if (!user) { return 401; }
// Then immediately proceeds to delete — no role check, no ownership check
```

## The Fix

Two authorization checks were added:

1. **Role check** — Only `admin` and `editor` roles can delete articles:
```ts
if (!ALLOWED_ROLES.has(user.role)) {
  return { status: 403, body: { message: "Forbidden: insufficient permission" } };
}
```

2. **Ownership check** — Editors can only delete their own articles (admins can delete any):
```ts
if (user.role !== "admin" && article.authorId !== user.id) {
  return { status: 403, body: { message: "Forbidden: you can only delete your own articles" } };
}
```

## Key Takeaway

Authentication and authorization are different concerns. Authentication verifies identity ("who are you?"), while authorization verifies permissions ("what are you allowed to do?"). Broken access control is the #1 risk in the OWASP Top 10. Always check both before performing sensitive operations.
