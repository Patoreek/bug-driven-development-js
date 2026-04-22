# Hint 3 (Strong)

Add these checks after the token verification but before the deletion:

```ts
// Role check
const ALLOWED_ROLES = new Set(["admin", "editor"]);
if (!ALLOWED_ROLES.has(user.role)) {
  return { status: 403, body: { message: "Forbidden: insufficient permission" } };
}

// Look up the article (return 404 if not found)
const article = getArticle(ctx.articleId);
if (!article) {
  return { status: 404, body: { message: "Article not found" } };
}

// Ownership check: editors can only delete their own
if (user.role !== "admin" && article.authorId !== user.id) {
  return { status: 403, body: { message: "Forbidden: you can only delete your own articles" } };
}
```
