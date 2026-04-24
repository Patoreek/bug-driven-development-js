# Hint 3

Replace `.filter(Boolean)` with an explicit check:

```ts
.filter((item) => item !== null && item !== undefined)
```

Or use loose inequality which covers both `null` and `undefined`:

```ts
.filter((item) => item != null)
```

For TypeScript, add a type predicate like `(item): item is number =>` to get proper type narrowing.
