# Hint 3 (Strong)

The fix is straightforward — you need to swap when `T` is naked vs wrapped:

- **`ExtractStrings`, `ExtractFunctions`, `NonNullableDeep`, `TypeName`** all need **naked** `T` (remove the `[T] extends [...]` wrapping). Change them to `T extends ...`.

- **`IsNever`** needs the opposite — **wrap** `T` in a tuple: `[T] extends [never] ? true : false`. This prevents distribution over `never` (which is the empty union and distributes zero times).

For example, `ExtractStrings` should be:
```typescript
type ExtractStrings<T> = T extends string ? T : never;
```

And `IsNever` should be:
```typescript
type IsNever<T> = [T] extends [never] ? true : false;
```
