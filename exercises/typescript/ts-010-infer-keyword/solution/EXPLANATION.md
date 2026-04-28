# Solution: The infer Keyword -- Type-Level Pattern Matching

## The Bug

The `infer` keyword in TypeScript conditional types acts like a type variable that captures whatever type appears at its position. Each bug comes down to either placing `infer` in the wrong position, or failing to recurse when the extracted type may itself need further extraction.

## The Fixes

### 1. GetReturnType: infer in wrong position

```typescript
// Before -- infer captures parameter types
type GetReturnType<T> = T extends (...args: infer R) => any ? R : never;
// GetReturnType<(x: string) => number> = [string]

// After -- infer captures return type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
// GetReturnType<(x: string) => number> = number
```

The position of `infer` determines what gets extracted. In a function type `(...args: A) => B`, `infer` in the `A` position captures parameters, and in the `B` position captures the return type. This is exactly how TypeScript's built-in `ReturnType<T>` and `Parameters<T>` work.

### 2. UnpackPromise: Missing recursion

```typescript
// Before -- single unwrap
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
// UnpackPromise<Promise<Promise<string>>> = Promise<string>

// After -- recursive unwrap
type UnpackPromise<T> = T extends Promise<infer U> ? UnpackPromise<U> : T;
// UnpackPromise<Promise<Promise<string>>> = string
```

This mirrors TypeScript's built-in `Awaited<T>` type, which recursively unwraps `Promise`/`PromiseLike`.

### 3. FirstElement: infer captures the rest, not the first

```typescript
// Before -- captures tail
type FirstElement<T extends readonly unknown[]> =
  T extends [any, ...infer First] ? First : never;
// FirstElement<[string, number]> = [number]

// After -- captures head
type FirstElement<T extends readonly unknown[]> =
  T extends [infer First, ...any[]] ? First : never;
// FirstElement<[string, number]> = string
```

In tuple destructuring patterns, `[infer First, ...any[]]` captures the first element while `[any, ...infer Rest]` captures everything after the first.

### 4. ConstructorParams: infer on instance instead of params

```typescript
// Before -- captures instance type
T extends abstract new (...args: any) => infer P ? P : never;

// After -- captures parameter types
T extends abstract new (...args: infer P) => any ? P : never;
```

### 5. FlattenArray: Missing recursion

```typescript
// Before -- single unwrap
type FlattenArray<T> = T extends Array<infer U> ? U : T;
// FlattenArray<number[][]> = number[]

// After -- recursive unwrap
type FlattenArray<T> = T extends Array<infer U> ? FlattenArray<U> : T;
// FlattenArray<number[][]> = number
```

### 6. ExtractEventData: no infer for data

```typescript
// Before -- matches but doesn't extract data
type ExtractEventData<T> = T extends Event<string, unknown> ? T : never;

// After -- infer captures the data type
type ExtractEventData<T> = T extends Event<string, infer D> ? D : never;
```

## Key Takeaways

1. **Position matters**: `infer` captures the type at exactly the position where you place it
2. **Recursion for deep extraction**: When the extracted type may itself need unwrapping, recurse
3. **Pattern matching**: `infer` works like destructuring -- `[infer Head, ...infer Tail]` mirrors JavaScript's `const [head, ...tail]`
4. **Built-in equivalents**: TypeScript provides `ReturnType`, `Parameters`, `ConstructorParameters`, and `Awaited` -- understanding `infer` is how you build your own

## Related Documentation

- [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## Interview Context

The `infer` keyword is a staple of TypeScript interviews at the senior level. Common questions include:
- Implement `ReturnType<T>` from scratch using `infer`
- Build a `DeepAwaited<T>` that recursively unwraps Promises
- Extract specific elements from tuple types using `infer` with rest patterns
- Explain the difference between `infer` in covariant vs contravariant positions (e.g., parameter position gives intersection, return position gives union)
