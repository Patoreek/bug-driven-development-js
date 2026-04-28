# Hint 2 (Medium)

The branding pattern works by intersecting the base type with a phantom property that exists only at the type level:

```typescript
type Brand<T, B extends string> = T & { readonly [__brand]: B };
```

Key points:
- Use `[__brand]` (computed property with unique symbol) instead of `__brand` (string literal key)
- Each type needs a **unique** brand string: `"UserId"`, `"OrderId"`, `"ProductId"`, `"USD"`, `"EUR"`
- Constructor functions must return the branded type and use `as` to assert: `return id as UserId;`
- Functions that consume branded types must use the branded type in their parameter signatures, not plain `string`/`number`
