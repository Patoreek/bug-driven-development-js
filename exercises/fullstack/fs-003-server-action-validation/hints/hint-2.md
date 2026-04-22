# Hint 2 (Medium)

You need a validation library like Zod. Define a schema with constraints: `title` must be non-empty and max 200 chars, `priority` must be a number between 1-5, `email` must be valid format. Use `safeParse` to get structured errors without throwing.
