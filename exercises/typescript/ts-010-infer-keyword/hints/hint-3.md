# Hint 3 (Strong)

Here are the specific fixes:

**GetReturnType:** Move `infer R` from parameter position to return position:
```typescript
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

**UnpackPromise:** Add recursion -- unwrap and check again:
```typescript
type UnpackPromise<T> = T extends Promise<infer U> ? UnpackPromise<U> : T;
```

**FirstElement:** Swap the positions -- `infer First` goes before the rest spread:
```typescript
type FirstElement<T extends readonly unknown[]> =
  T extends [infer First, ...any[]] ? First : never;
```

**ConstructorParams:** Move `infer P` from the instance position to the parameter position:
```typescript
type ConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;
```

**FlattenArray:** Add recursion:
```typescript
type FlattenArray<T> = T extends Array<infer U> ? FlattenArray<U> : T;
```

**ExtractEventData:** Use `infer D` to capture the data type:
```typescript
type ExtractEventData<T> = T extends Event<string, infer D> ? D : never;
```
