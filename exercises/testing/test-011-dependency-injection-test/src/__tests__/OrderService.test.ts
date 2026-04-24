import { OrderService, type Product, type Order, type PaymentResult } from "../OrderService";

// BUG: Tests create "real" dependency objects that make actual HTTP-like calls
// and share mutable state. There's no dependency injection -- the tests
// instantiate concrete implementations instead of injecting mocks.
// This makes tests slow, flaky, coupled, and impossible to run in CI.

// BUG: "Real" HTTP client that simulates network calls with delays and shared state
class RealHttpClient {
  private data: Record<string, unknown> = {};
  private requestCount = 0;

  async get<T>(url: string): Promise<T> {
    this.requestCount++;
    // BUG: Simulating real network latency -- makes tests slow and flaky
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

    if (url.startsWith("/api/products/")) {
      const id = url.split("/").pop();
      // BUG: Hardcoded product data that's shared across tests
      const products: Record<string, Product> = {
        "prod-1": { id: "prod-1", name: "Widget", price: 29.99, stock: 10 },
        "prod-2": { id: "prod-2", name: "Gadget", price: 49.99, stock: 5 },
        "prod-3": { id: "prod-3", name: "Doohickey", price: 9.99, stock: 0 },
      };
      if (!id || !products[id]) throw new Error("Product not found");
      return products[id] as T;
    }

    if (url.startsWith("/api/orders/")) {
      const id = url.split("/").pop();
      // BUG: Returns from shared mutable state
      return (this.data[`order-${id}`] ?? {
        id,
        items: [],
        total: 0,
        status: "pending",
        createdAt: new Date().toISOString(),
      }) as T;
    }

    throw new Error(`Unknown URL: ${url}`);
  }

  async post<T>(url: string, body: unknown): Promise<T> {
    this.requestCount++;
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

    if (url === "/api/payments") {
      // BUG: Simulates a payment that randomly fails (flaky!)
      const success = Math.random() > 0.1;
      return {
        success,
        transactionId: success ? `txn-${Date.now()}` : undefined,
        error: success ? undefined : "Random failure",
      } as T;
    }

    if (url === "/api/orders") {
      const order = {
        id: `order-${Date.now()}`,
        ...(body as object),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      // BUG: Mutates shared state
      this.data[`order-${order.id}`] = order;
      return order as T;
    }

    if (url === "/api/payments/refund") {
      return { success: true, transactionId: `refund-${Date.now()}` } as T;
    }

    if (url.endsWith("/cancel")) {
      const id = url.split("/")[3];
      const order = {
        id,
        items: [],
        total: 0,
        status: "failed",
        createdAt: new Date().toISOString(),
      };
      this.data[`order-${id}`] = order;
      return order as T;
    }

    throw new Error(`Unknown URL: ${url}`);
  }

  getRequestCount() {
    return this.requestCount;
  }
}

// BUG: "Real" logger that writes to console (noisy in tests, hard to assert on)
class RealLogger {
  private logs: string[] = [];

  info(message: string, meta?: Record<string, unknown>) {
    const entry = `[INFO] ${message} ${JSON.stringify(meta)}`;
    this.logs.push(entry);
    console.log(entry); // BUG: Pollutes test output
  }

  error(message: string, meta?: Record<string, unknown>) {
    const entry = `[ERROR] ${message} ${JSON.stringify(meta)}`;
    this.logs.push(entry);
    console.error(entry); // BUG: Pollutes test output
  }

  warn(message: string, meta?: Record<string, unknown>) {
    const entry = `[WARN] ${message} ${JSON.stringify(meta)}`;
    this.logs.push(entry);
    console.warn(entry); // BUG: Pollutes test output
  }

  getLogs() {
    return this.logs;
  }
}

// BUG: Shared instances across all tests -- no isolation
const httpClient = new RealHttpClient();
const logger = new RealLogger();

describe("OrderService", () => {
  // BUG: No beforeEach to reset state -- tests leak into each other

  it("should create an order successfully", async () => {
    const service = new OrderService(httpClient, logger);
    const quantities = new Map([
      ["prod-1", 2],
      ["prod-2", 1],
    ]);

    // BUG: This test is flaky because the payment randomly fails
    const order = await service.createOrder(["prod-1", "prod-2"], quantities);

    expect(order.status).toBe("confirmed");
    expect(order.total).toBe(109.97); // 29.99 * 2 + 49.99
  }, 10000); // BUG: Long timeout to account for random delays

  it("should reject order with insufficient stock", async () => {
    const service = new OrderService(httpClient, logger);
    const quantities = new Map([["prod-3", 1]]);

    // BUG: prod-3 has stock=0, so this should fail, but the error message
    // depends on the hardcoded data in the fake HTTP client
    await expect(
      service.createOrder(["prod-3"], quantities)
    ).rejects.toThrow("Insufficient stock");
  }, 10000);

  it("should get order status", async () => {
    const service = new OrderService(httpClient, logger);

    // BUG: Depends on a previously created order from shared state
    const order = await service.getOrderStatus("some-order-id");

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
  }, 10000);

  it("should cancel a pending order", async () => {
    const service = new OrderService(httpClient, logger);

    // BUG: Depends on shared state having an order in "pending" status
    // This only works if the get() for this ID returns status "pending"
    const result = await service.cancelOrder("test-cancel-id");

    expect(result.status).toBe("failed");
  }, 10000);

  it("should log operations", async () => {
    const service = new OrderService(httpClient, logger);
    const quantities = new Map([["prod-1", 1]]);

    // BUG: Logger is shared, so it contains logs from ALL previous tests
    const logsBefore = logger.getLogs().length;

    try {
      await service.createOrder(["prod-1"], quantities);
    } catch {
      // Payment might randomly fail
    }

    // BUG: Fragile assertion -- just checks that "some" logs were added
    expect(logger.getLogs().length).toBeGreaterThan(logsBefore);
  }, 10000);

  it("should handle payment failure", async () => {
    const service = new OrderService(httpClient, logger);
    const quantities = new Map([["prod-1", 1]]);

    // BUG: Since payment randomly fails, we retry until it fails
    // This is incredibly fragile and slow
    let failed = false;
    for (let i = 0; i < 50; i++) {
      try {
        await service.createOrder(["prod-1"], quantities);
      } catch (err) {
        if ((err as Error).message.includes("Payment failed")) {
          failed = true;
          break;
        }
      }
    }

    expect(failed).toBe(true);
  }, 60000); // BUG: Extremely long timeout
});
