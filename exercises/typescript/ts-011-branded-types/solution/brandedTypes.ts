// FIX: Proper branded types with unique brands and branded constructors

// FIX 1: Use a unique symbol for the brand key so it can't be accidentally
// satisfied by regular objects.
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

// FIX 2: Each branded type uses a unique brand string,
// making UserId, OrderId, and ProductId mutually incompatible.
export type UserId = Brand<string, "UserId">;
export type OrderId = Brand<string, "OrderId">;
export type ProductId = Brand<string, "ProductId">;

// FIX 3: Validation functions return the branded type via type assertion.
// This is the standard pattern: validate at runtime, brand at the type level.
export function createUserId(id: string): UserId {
  if (!id.startsWith("usr_")) {
    throw new Error("User ID must start with 'usr_'");
  }
  return id as UserId;
}

export function createOrderId(id: string): OrderId {
  if (!id.startsWith("ord_")) {
    throw new Error("Order ID must start with 'ord_'");
  }
  return id as OrderId;
}

export function createProductId(id: string): ProductId {
  if (!id.startsWith("prd_")) {
    throw new Error("Product ID must start with 'prd_'");
  }
  return id as ProductId;
}

// FIX 4: Each currency uses a unique brand string.
export type USD = Brand<number, "USD">;
export type EUR = Brand<number, "EUR">;

export function usd(amount: number): USD {
  if (amount < 0) throw new Error("Amount cannot be negative");
  return amount as USD;
}

export function eur(amount: number): EUR {
  if (amount < 0) throw new Error("Amount cannot be negative");
  return amount as EUR;
}

// FIX 5: processOrder requires branded types, not plain strings.
// This ensures callers must validate IDs before passing them.
export function processOrder(
  userId: UserId,
  orderId: OrderId,
  productId: ProductId,
): { userId: UserId; orderId: OrderId; productId: ProductId } {
  return { userId, orderId, productId };
}

// FIX 6: calculateTotal requires USD branded type for price,
// enforcing currency type safety.
export function calculateTotal(
  price: USD,
  quantity: number,
): USD {
  return (price * quantity) as USD;
}

// Type-level assertion helpers
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;
