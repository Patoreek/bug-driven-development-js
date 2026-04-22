# Hint 2 (Medium)

Use TypeScript's `Pick<User, "id" | "name" | "avatar">` to create a type with only the needed fields. Then use destructuring to return just those fields: `users.map(({ id, name, avatar }) => ({ id, name, avatar }))`.
