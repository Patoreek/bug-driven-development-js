# Solution: Template Literal Types -- String Manipulation at the Type Level

## The Bug

Template literal types in TypeScript allow string manipulation at the type level, but they require careful use of intrinsic types (`Capitalize`, `Lowercase`, etc.), correct `infer` patterns, and proper recursive tuple construction.

## The Fixes

### 1. EventName: Missing Capitalize

```typescript
// Before -- lowercase event name
type EventName<T extends string> = `on${T}`;
// EventName<"click"> = "onclick"

// After -- capitalize first letter
type EventName<T extends string> = `on${Capitalize<T>}`;
// EventName<"click"> = "onClick"
```

TypeScript's `Capitalize<T>` is an intrinsic type (implemented in the compiler, not in userland). It uppercases the first character of a string literal type.

### 2. CSSProperty: Missing Lowercase on inserted letter

```typescript
// Before -- uppercase letter preserved after hyphen
`-${Head}${CSSProperty<Tail>}`
// CSSProperty<"fontSize"> = "font-Size"

// After -- convert to lowercase
`-${Lowercase<Head>}${CSSProperty<Tail>}`
// CSSProperty<"fontSize"> = "font-size"
```

### 3. PathParam: Colon included in result

```typescript
// Before -- colon leaks into the extracted parameter
? `:${Param}` | PathParam<`/${Rest}`>
// PathParam<"/users/:id"> = ":id"

// After -- return just the parameter name
? Param | PathParam<`/${Rest}`>
// PathParam<"/users/:id"> = "id"
```

The `infer` keyword already captures the text *after* the colon. Re-adding `:` with a template literal double-prefixes it.

### 4. DotPath: Wrong separator and missing top-level keys

```typescript
// Before -- uses "/" separator, only emits leaf paths
[K in keyof T & string]: DotPath<T[K], `${Prefix}/${K}`>;

// After -- uses "." separator, emits both current key and recursive paths
[K in keyof T & string]:
  | (Prefix extends "" ? K : `${Prefix}.${K}`)
  | DotPath<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>;
```

The fix includes each key as its own path (e.g., `"user"`) and recurses to produce nested paths (e.g., `"user.name"`). The base case returns `never` instead of `Prefix` since the key is already emitted in the object branch.

### 5. Split: Reversed tuple order

```typescript
// Before -- Head at the end
? [...Split<Tail, D>, Head]
// Split<"a.b.c", "."> = ["c", "b", "a"]

// After -- Head at the beginning
? [Head, ...Split<Tail, D>]
// Split<"a.b.c", "."> = ["a", "b", "c"]
```

When building a tuple recursively from a left-to-right string parse, the current element (`Head`) must go first, followed by the recursive result.

## Key Takeaways

- TypeScript provides four intrinsic string manipulation types: `Capitalize`, `Uncapitalize`, `Uppercase`, `Lowercase`
- `infer` in template literal types captures the *matched* portion -- be careful not to re-add characters that were part of the pattern
- Recursive template literal types can build tuples, but order matters -- place the current element before the recursive spread for left-to-right order
- Recursive types on objects need union (`|`) to emit paths at every depth, not just the leaves

## Related Documentation

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Intrinsic String Manipulation Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#intrinsic-string-manipulation-types)
- [TypeScript 4.1 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html)

## Interview Context

Template literal types are a popular advanced TypeScript interview topic. Interviewers commonly ask candidates to:
- Build a type-safe event emitter using template literal types for handler names
- Convert between camelCase and kebab-case at the type level
- Extract parameters from route strings (like Express/Next.js route patterns)
- Explain the difference between `Capitalize` and `Uppercase` (first char vs all chars)
- Build recursive string manipulation types like `Split`, `Join`, or `Replace`
