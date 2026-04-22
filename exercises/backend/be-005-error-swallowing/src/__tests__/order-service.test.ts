import { describe, it, expect } from "vitest";
import { processOrder } from "../order-service";

describe("processOrder", () => {
  it("should return 200 with orderId for a valid order", async () => {
    const result = await processOrder(
      [{ productId: "prod-1", quantity: 2 }],
      50
    );

    expect(result.status).toBe(200);
    expect(result.body.orderId).toBeDefined();
    expect(result.body.error).toBeUndefined();
  });

  it("should return 400 with EMPTY_ORDER code when items array is empty", async () => {
    const result = await processOrder([], 50);

    expect(result.status).toBe(400);
    expect(result.body.code).toBe("EMPTY_ORDER");
    expect(result.body.error).toMatch(/items|empty/i);
    expect(result.body.orderId).toBeUndefined();
  });

  it("should return 404 with PRODUCT_NOT_FOUND code for unknown products", async () => {
    const result = await processOrder(
      [{ productId: "nonexistent", quantity: 1 }],
      10
    );

    expect(result.status).toBe(404);
    expect(result.body.code).toBe("PRODUCT_NOT_FOUND");
    expect(result.body.error).toContain("nonexistent");
  });

  it("should return 409 with OUT_OF_STOCK code when insufficient inventory", async () => {
    const result = await processOrder(
      [{ productId: "prod-2", quantity: 1 }],
      10
    );

    expect(result.status).toBe(409);
    expect(result.body.code).toBe("OUT_OF_STOCK");
    expect(result.body.error).toMatch(/stock|inventory/i);
  });

  it("should return 402 with PAYMENT_DECLINED code when payment exceeds limit", async () => {
    const result = await processOrder(
      [{ productId: "prod-1", quantity: 1 }],
      1500
    );

    expect(result.status).toBe(402);
    expect(result.body.code).toBe("PAYMENT_DECLINED");
    expect(result.body.error).toMatch(/payment|declined|limit/i);
  });

  it("should return 400 with INVALID_PAYMENT code when amount is zero or negative", async () => {
    const result = await processOrder(
      [{ productId: "prod-1", quantity: 1 }],
      0
    );

    expect(result.status).toBe(400);
    expect(result.body.code).toBe("INVALID_PAYMENT");
    expect(result.body.error).toMatch(/invalid|payment|amount/i);
  });

  it("should never return the generic 'Something went wrong' message", async () => {
    const testCases = [
      { items: [], amount: 50 },
      { items: [{ productId: "bad", quantity: 1 }], amount: 10 },
      { items: [{ productId: "prod-2", quantity: 1 }], amount: 10 },
      { items: [{ productId: "prod-1", quantity: 1 }], amount: 2000 },
      { items: [{ productId: "prod-1", quantity: 1 }], amount: -5 },
    ];

    for (const tc of testCases) {
      const result = await processOrder(tc.items, tc.amount);
      expect(result.body.error).not.toBe("Something went wrong");
    }
  });

  it("should include error code in all error responses", async () => {
    const errorCases = [
      { items: [], amount: 50 },
      { items: [{ productId: "bad", quantity: 1 }], amount: 10 },
      { items: [{ productId: "prod-2", quantity: 1 }], amount: 10 },
      { items: [{ productId: "prod-1", quantity: 1 }], amount: 2000 },
    ];

    for (const tc of errorCases) {
      const result = await processOrder(tc.items, tc.amount);
      expect(result.body.code).toBeDefined();
      expect(typeof result.body.code).toBe("string");
    }
  });
});
