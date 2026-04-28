# Hint 3 (Strong)

Here are the specific fixes:

**EventName:** Change `` `on${T}` `` to `` `on${Capitalize<T>}` ``

**CSSProperty:** Change `` `-${Head}${CSSProperty<Tail>}` `` to `` `-${Lowercase<Head>}${CSSProperty<Tail>}` ``

**PathParam:** Change `` `:${Param}` `` to just `Param` in both branches of the conditional.

**DotPath:** Replace `/` with `.` in the prefix concatenation, and use a union to include both the current key and the recursive result:
```typescript
| (Prefix extends "" ? K : `${Prefix}.${K}`)
| DotPath<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
```
Return `never` instead of `Prefix` for the leaf base case (the prefix is already emitted by the object branch).

**Split:** Change `[...Split<Tail, D>, Head]` to `[Head, ...Split<Tail, D>]`.
