# Explanation: SQL Injection in Query Builder

## The Bug

Every query function built SQL strings by directly interpolating user input using template literals:

```ts
`SELECT * FROM users WHERE name = '${name}'`
```

This means a user could supply `'; DROP TABLE users; --` and the resulting SQL would be:

```sql
SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
```

This executes an arbitrary `DROP TABLE` command — a classic SQL injection attack.

## The Fix

Replace string interpolation with parameterized queries using `$1`, `$2`, etc. placeholders:

```ts
{
  text: `SELECT * FROM users WHERE name = $1`,
  params: [name],
}
```

The database driver treats parameters as data, not as part of the SQL command. Even if the input contains SQL syntax, it is safely escaped by the driver.

For the `LIKE` query, the wildcard `%` characters are moved into the parameter value itself:

```ts
params: [`%${namePattern}%`, minAge, maxAge]
```

## Key Takeaway

Never build SQL strings by concatenating or interpolating user input. Always use parameterized queries. This is the single most effective defense against SQL injection, which remains one of the most common and dangerous web vulnerabilities.
