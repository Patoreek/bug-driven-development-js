# Hint 3 (Strong)

For the `searchUsers` function, the `LIKE` wildcards (`%`) need to be part of the parameter value, not the SQL text:

```ts
// The SQL text uses a plain placeholder
text: `SELECT * FROM users WHERE name LIKE $1 AND age BETWEEN $2 AND $3`
// The wildcards wrap the pattern in the params array
params: [`%${namePattern}%`, minAge, maxAge]
```

For `updateUserEmail`, note the test expects params in order `[newEmail, userId]` — match the order of `$1` and `$2` to `SET email = $1 WHERE id = $2`.
