# Hint 3 (Strong)

Here are the specific fixes:

**Brand type:** Use a unique symbol computed property:
```typescript
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };
```

**Unique brand strings:**
```typescript
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
type ProductId = Brand<string, "ProductId">;
type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;
```

**Constructor functions return branded types:**
```typescript
function createUserId(id: string): UserId {
  if (!id.startsWith("usr_")) throw new Error("...");
  return id as UserId;
}
```

**Consumer functions accept branded types:**
```typescript
function processOrder(userId: UserId, orderId: OrderId, productId: ProductId): { ... }
function calculateTotal(price: USD, quantity: number): USD {
  return (price * quantity) as USD;
}
```
