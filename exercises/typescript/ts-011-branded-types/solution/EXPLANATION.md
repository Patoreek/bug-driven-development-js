# Solution: Branded Types -- Nominal Typing in a Structural World

## The Bug

TypeScript uses **structural typing**: two types are compatible if they have the same shape. This means `string` is `string` regardless of semantic meaning -- a user ID, order ID, and product ID are all interchangeable. Branded types solve this by adding a phantom property that makes each type structurally unique.

The buggy implementation failed in three ways:
1. All ID brands used the same string, making them structurally identical
2. Constructor functions returned plain types, not branded types
3. Consumer functions accepted plain types, bypassing the brand system entirely

## The Fixes

### 1. Use unique symbol for brand key

```typescript
// Before -- plain property key, can be accidentally matched
type Brand<T, B extends string> = T & { __brand: B };

// After -- unique symbol key, impossible to accidentally match
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };
```

Using `[__brand]` (a computed property with a unique symbol) ensures no regular object can accidentally satisfy the brand. The `readonly` prevents modification.

### 2. Give each type a unique brand

```typescript
// Before -- all use "id", making them interchangeable
type UserId = Brand<string, "id">;
type OrderId = Brand<string, "id">;

// After -- unique brands
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
type ProductId = Brand<string, "ProductId">;
type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;
```

### 3. Constructor functions return branded types

```typescript
// Before -- returns plain string, no type-level enforcement
function createUserId(id: string): string {
  // ...validation...
  return id;
}

// After -- returns branded type via type assertion
function createUserId(id: string): UserId {
  // ...validation...
  return id as UserId;
}
```

The `as UserId` assertion is safe here because the runtime validation has already confirmed the value meets the domain rules. This is the standard pattern: **validate at runtime, brand at compile time**.

### 4. Consumer functions require branded types

```typescript
// Before -- accepts any string
function processOrder(userId: string, orderId: string, productId: string)

// After -- requires specific branded types
function processOrder(userId: UserId, orderId: OrderId, productId: ProductId)
```

This creates a closed loop: the only way to get a `UserId` is through `createUserId()`, which validates the format. Functions that require `UserId` are guaranteed to receive validated input.

## Key Takeaways

- **Structural typing gap**: TypeScript can't distinguish between semantically different values of the same base type without branding
- **Phantom properties**: The brand property exists only at the type level -- it adds zero runtime overhead
- **Validation boundary**: Branded constructors are the single entry point where `as` assertions are permitted; everywhere else the types flow naturally
- **Unique symbols**: Using `declare const __brand: unique symbol` ensures the brand key can never be accidentally matched by user code

## Related Documentation

- [TypeScript Handbook: Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [TypeScript Handbook: Symbols](https://www.typescriptlang.org/docs/handbook/symbols.html)
- [TypeScript Handbook: Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

## Interview Context

Branded types are a frequent topic in senior TypeScript interviews, especially for domain-driven design roles. Expect questions like:
- "How would you prevent mixing up user IDs and order IDs at the type level?"
- "What's the difference between nominal and structural typing? How do you simulate nominal types in TypeScript?"
- "Where is it safe to use `as` type assertions?" (Answer: at validation boundaries in branded constructors)
- "What are the runtime costs of branded types?" (Answer: zero -- the brand is erased at compile time)
- Branded types are also used in ORMs (Prisma's generated types), currency libraries, and authorization systems
