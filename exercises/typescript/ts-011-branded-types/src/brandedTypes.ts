// BUG: Branded types implementation with structural typing issues

// BUG 1: The brand declaration uses a regular property instead of a unique symbol
// or phantom type, so the brand can be accidentally satisfied by any object
// with a matching `__brand` property.
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { __brand: B };

// BUG 2: These branded types all use the same string brand "id",
// making them interchangeable. UserId, OrderId, and ProductId
// should be mutually incompatible, but they're all Brand<string, "id">.
export type UserId = Brand<string, "id">;
export type OrderId = Brand<string, "id">;
export type ProductId = Brand<string, "id">;

// BUG 3: The validation functions don't actually brand the return type.
// They return plain strings instead of branded types, so the type system
// doesn't enforce that values have been validated.
export function createUserId(id: string): string {
  if (!id.startsWith("usr_")) {
    throw new Error("User ID must start with 'usr_'");
  }
  return id;
}

export function createOrderId(id: string): string {
  if (!id.startsWith("ord_")) {
    throw new Error("Order ID must start with 'ord_'");
  }
  return id;
}

export function createProductId(id: string): string {
  if (!id.startsWith("prd_")) {
    throw new Error("Product ID must start with 'prd_'");
  }
  return id;
}

// BUG 4: These branded numeric types use the same brand too.
export type USD = Brand<number, "currency">;
export type EUR = Brand<number, "currency">;

export function usd(amount: number): number {
  if (amount < 0) throw new Error("Amount cannot be negative");
  return amount;
}

export function eur(amount: number): number {
  if (amount < 0) throw new Error("Amount cannot be negative");
  return amount;
}

// BUG 5: The processOrder function accepts plain strings instead of
// branded types, defeating the purpose of the branding system.
export function processOrder(
  userId: string,
  orderId: string,
  productId: string,
): { userId: string; orderId: string; productId: string } {
  return { userId, orderId, productId };
}

// BUG 6: The calculateTotal function accepts plain numbers
// and doesn't enforce currency type safety.
export function calculateTotal(
  price: number,
  quantity: number,
): number {
  return price * quantity;
}

// Type-level assertion helpers
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;
