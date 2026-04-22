# Hint 2 (Medium)

Replace each interpolated value in the SQL string with a numbered placeholder like `$1`, `$2`, etc. Then move the actual values into the `params` array in the corresponding order.

For example:
```ts
// Before (vulnerable)
text: `SELECT * FROM users WHERE name = '${name}'`
params: []

// After (safe)
text: `SELECT * FROM users WHERE name = $1`
params: [name]
```
