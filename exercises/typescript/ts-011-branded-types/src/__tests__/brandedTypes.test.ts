import { describe, it, expect } from "vitest";
import {
  type UserId,
  type OrderId,
  type ProductId,
  type USD,
  type EUR,
  type Expect,
  type Equal,
  type NotEqual,
  createUserId,
  createOrderId,
  createProductId,
  usd,
  eur,
  processOrder,
  calculateTotal,
} from "../brandedTypes";

describe("Branded ID types - mutual incompatibility", () => {
  it("UserId and OrderId are distinct types", () => {
    const check: Expect<NotEqual<UserId, OrderId>> = true;
    expect(check).toBe(true);
  });

  it("UserId and ProductId are distinct types", () => {
    const check: Expect<NotEqual<UserId, ProductId>> = true;
    expect(check).toBe(true);
  });

  it("OrderId and ProductId are distinct types", () => {
    const check: Expect<NotEqual<OrderId, ProductId>> = true;
    expect(check).toBe(true);
  });
});

describe("Branded currency types - mutual incompatibility", () => {
  it("USD and EUR are distinct types", () => {
    const check: Expect<NotEqual<USD, EUR>> = true;
    expect(check).toBe(true);
  });
});

describe("createUserId - validates and brands", () => {
  it("returns a UserId for valid input", () => {
    const id = createUserId("usr_123");
    expect(id).toBe("usr_123");
  });

  it("throws for invalid input", () => {
    expect(() => createUserId("invalid")).toThrow("User ID must start with 'usr_'");
  });

  it("return type is UserId, not plain string", () => {
    const id = createUserId("usr_123");
    type Result = typeof id;
    const check: Expect<Equal<Result, UserId>> = true;
    expect(check).toBe(true);
  });
});

describe("createOrderId - validates and brands", () => {
  it("returns an OrderId for valid input", () => {
    const id = createOrderId("ord_456");
    expect(id).toBe("ord_456");
  });

  it("throws for invalid input", () => {
    expect(() => createOrderId("invalid")).toThrow("Order ID must start with 'ord_'");
  });

  it("return type is OrderId, not plain string", () => {
    const id = createOrderId("ord_456");
    type Result = typeof id;
    const check: Expect<Equal<Result, OrderId>> = true;
    expect(check).toBe(true);
  });
});

describe("createProductId - validates and brands", () => {
  it("returns a ProductId for valid input", () => {
    const id = createProductId("prd_789");
    expect(id).toBe("prd_789");
  });

  it("throws for invalid input", () => {
    expect(() => createProductId("invalid")).toThrow("Product ID must start with 'prd_'");
  });

  it("return type is ProductId, not plain string", () => {
    const id = createProductId("prd_789");
    type Result = typeof id;
    const check: Expect<Equal<Result, ProductId>> = true;
    expect(check).toBe(true);
  });
});

describe("Currency constructors - validate and brand", () => {
  it("usd returns USD type", () => {
    const amount = usd(9.99);
    type Result = typeof amount;
    const check: Expect<Equal<Result, USD>> = true;
    expect(check).toBe(true);
    expect(amount).toBe(9.99);
  });

  it("eur returns EUR type", () => {
    const amount = eur(8.49);
    type Result = typeof amount;
    const check: Expect<Equal<Result, EUR>> = true;
    expect(check).toBe(true);
    expect(amount).toBe(8.49);
  });

  it("usd throws for negative amounts", () => {
    expect(() => usd(-1)).toThrow("Amount cannot be negative");
  });

  it("eur throws for negative amounts", () => {
    expect(() => eur(-1)).toThrow("Amount cannot be negative");
  });
});

describe("processOrder - requires branded types", () => {
  it("accepts branded IDs and returns branded result", () => {
    const userId = createUserId("usr_1");
    const orderId = createOrderId("ord_1");
    const productId = createProductId("prd_1");

    const result = processOrder(userId, orderId, productId);

    expect(result).toEqual({
      userId: "usr_1",
      orderId: "ord_1",
      productId: "prd_1",
    });

    type ResultType = typeof result;
    const check: Expect<
      Equal<ResultType, { userId: UserId; orderId: OrderId; productId: ProductId }>
    > = true;
    expect(check).toBe(true);
  });
});

describe("calculateTotal - enforces currency branding", () => {
  it("returns USD type for USD price", () => {
    const price = usd(9.99);
    const result = calculateTotal(price, 3);

    type ResultType = typeof result;
    const check: Expect<Equal<ResultType, USD>> = true;
    expect(check).toBe(true);
    expect(result).toBeCloseTo(29.97);
  });
});
