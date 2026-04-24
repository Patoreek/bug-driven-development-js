# Solution: Conditional Types — Distributive vs Non-Distributive

## The Bug

TypeScript conditional types have a critical behavior: **distribution over unions happens ONLY when the checked type is a "naked" type parameter** (not wrapped in a tuple, array, or other type).

### The Rule

```typescript
// DISTRIBUTIVE (naked T):
type A<T> = T extends string ? T : never;
// A<string | number> = (string extends string ? string : never) | (number extends string ? number : never) = string

// NON-DISTRIBUTIVE (wrapped [T]):
type B<T> = [T] extends [string] ? T : never;
// B<string | number> = [string | number] extends [string] ? (string | number) : never = never
```

### Where each pattern is correct

| Pattern | When to Use | Example |
|---------|-------------|---------|
| Naked `T` | Filtering/mapping union members | `ExtractStrings`, `TypeName`, `NonNullable` |
| Wrapped `[T]` | Checking the whole type without distribution | `IsNever`, `IsUnion` |

## The Fix

### ExtractStrings: Use naked `T`
```typescript
// Before (non-distributive — wrong)
type ExtractStrings<T> = [T] extends [string] ? T : never;

// After (distributive — correct)
type ExtractStrings<T> = T extends string ? T : never;
```

### IsNever: Use wrapped `[T]`
```typescript
// Before (distributive — wrong for never)
type IsNever<T> = T extends never ? true : false;
// IsNever<never> = (distributes zero times) = never

// After (non-distributive — correct)
type IsNever<T> = [T] extends [never] ? true : false;
// IsNever<never> = [never] extends [never] ? true : false = true
```

### TypeName: Use naked `T`
```typescript
// Before (non-distributive — falls through)
type TypeName<T> = [T] extends [string] ? "string" : ...

// After (distributive — maps each member)
type TypeName<T> = T extends string ? "string" : ...
```

## Key Takeaway

The `[T] extends [...]` tuple wrapping trick is the standard way to control distribution. Remember:
- **Need to filter/map each member of a union?** Use naked `T`
- **Need to check the type as a whole (especially `never`)?** Use `[T]`

## Related Documentation

- [Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
- [TypeScript 2.8 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)

## Interview Context

This is a very common TypeScript interview topic. Interviewers expect:
- Clear explanation of when distribution happens (naked type parameters only)
- Knowledge of the `[T] extends [...]` trick to prevent distribution
- Understanding of why `IsNever` needs non-distributive form
- Ability to explain `never` as the "empty union" that distributes zero times
