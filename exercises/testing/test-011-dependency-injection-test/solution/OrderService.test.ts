import {
  OrderService,
  type HttpClient,
  type Logger,
  type Product,
  type Order,
  type PaymentResult,
} from "../OrderService";

// FIXED: Create mock dependencies via factory functions for complete isolation

function createMockHttpClient(
  overrides?: Partial<HttpClient>
): HttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    ...overrides,
  };
}

function createMockLogger(): Logger {
  return {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };
}

const sampleProduct: Product = {
  id: "prod-1",
  name: "Widget",
  price: 29.99,
  stock: 10,
};

const sampleProduct2: Product = {
  id: "prod-2",
  name: "Gadget",
  price: 49.99,
  stock: 5,
};

describe("OrderService", () => {
  let httpClient: ReturnType<typeof createMockHttpClient>;
  let logger: ReturnType<typeof createMockLogger>;
  let service: OrderService;

  beforeEach(() => {
    httpClient = createMockHttpClient();
    logger = createMockLogger();
    service = new OrderService(httpClient, logger);
  });

  describe("createOrder", () => {
    it("should create an order successfully", async () => {
      // Arrange: configure mock responses
      vi.mocked(httpClient.get)
        .mockResolvedValueOnce(sampleProduct)
        .mockResolvedValueOnce(sampleProduct2);

      vi.mocked(httpClient.post)
        .mockResolvedValueOnce({
          success: true,
          transactionId: "txn-123",
        } satisfies PaymentResult)
        .mockResolvedValueOnce({
          id: "order-1",
          items: [
            { productId: "prod-1", quantity: 2, price: 29.99 },
            { productId: "prod-2", quantity: 1, price: 49.99 },
          ],
          total: 109.97,
          status: "confirmed",
          createdAt: "2025-01-01T00:00:00Z",
        } satisfies Order);

      const quantities = new Map([
        ["prod-1", 2],
        ["prod-2", 1],
      ]);

      // Act
      const order = await service.createOrder(["prod-1", "prod-2"], quantities);

      // Assert
      expect(order.status).toBe("confirmed");
      expect(order.total).toBe(109.97);
      expect(httpClient.get).toHaveBeenCalledWith("/api/products/prod-1");
      expect(httpClient.get).toHaveBeenCalledWith("/api/products/prod-2");
      expect(httpClient.post).toHaveBeenCalledWith("/api/payments", {
        total: 109.97,
        items: [
          { productId: "prod-1", quantity: 2, price: 29.99 },
          { productId: "prod-2", quantity: 1, price: 49.99 },
        ],
      });
      expect(logger.info).toHaveBeenCalledWith(
        "Order created successfully",
        expect.objectContaining({ orderId: "order-1" })
      );
    });

    it("should reject order with insufficient stock", async () => {
      const outOfStockProduct: Product = {
        id: "prod-3",
        name: "Doohickey",
        price: 9.99,
        stock: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce(outOfStockProduct);

      const quantities = new Map([["prod-3", 1]]);

      await expect(
        service.createOrder(["prod-3"], quantities)
      ).rejects.toThrow(
        'Insufficient stock for "Doohickey": requested 1, available 0'
      );

      expect(logger.warn).toHaveBeenCalledWith(
        "Insufficient stock",
        expect.objectContaining({
          productId: "prod-3",
          requested: 1,
          available: 0,
        })
      );
      // Payment should never be attempted
      expect(httpClient.post).not.toHaveBeenCalled();
    });

    it("should reject order with invalid quantity", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce(sampleProduct);

      const quantities = new Map([["prod-1", 0]]);

      await expect(
        service.createOrder(["prod-1"], quantities)
      ).rejects.toThrow("Invalid quantity for product prod-1");
    });

    it("should handle payment failure", async () => {
      vi.mocked(httpClient.get).mockResolvedValueOnce(sampleProduct);
      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: false,
        error: "Card declined",
      } satisfies PaymentResult);

      const quantities = new Map([["prod-1", 1]]);

      await expect(
        service.createOrder(["prod-1"], quantities)
      ).rejects.toThrow("Payment failed: Card declined");

      expect(logger.error).toHaveBeenCalledWith(
        "Payment failed",
        expect.objectContaining({ error: "Card declined" })
      );
    });
  });

  describe("getOrderStatus", () => {
    it("should fetch and return order status", async () => {
      const order: Order = {
        id: "order-1",
        items: [{ productId: "prod-1", quantity: 1, price: 29.99 }],
        total: 29.99,
        status: "confirmed",
        createdAt: "2025-01-01T00:00:00Z",
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce(order);

      const result = await service.getOrderStatus("order-1");

      expect(result).toEqual(order);
      expect(httpClient.get).toHaveBeenCalledWith("/api/orders/order-1");
      expect(logger.info).toHaveBeenCalledWith(
        "Fetching order status",
        expect.objectContaining({ orderId: "order-1" })
      );
    });
  });

  describe("cancelOrder", () => {
    it("should cancel a pending order with refund", async () => {
      const pendingOrder: Order = {
        id: "order-1",
        items: [{ productId: "prod-1", quantity: 1, price: 29.99 }],
        total: 29.99,
        status: "pending",
        createdAt: "2025-01-01T00:00:00Z",
      };

      const cancelledOrder: Order = { ...pendingOrder, status: "failed" };

      vi.mocked(httpClient.get).mockResolvedValueOnce(pendingOrder);
      vi.mocked(httpClient.post)
        .mockResolvedValueOnce({
          success: true,
          transactionId: "refund-123",
        } satisfies PaymentResult)
        .mockResolvedValueOnce(cancelledOrder);

      const result = await service.cancelOrder("order-1");

      expect(result.status).toBe("failed");
      expect(httpClient.post).toHaveBeenCalledWith("/api/payments/refund", {
        orderId: "order-1",
      });
      expect(httpClient.post).toHaveBeenCalledWith(
        "/api/orders/order-1/cancel",
        {}
      );
    });

    it("should reject cancellation of non-pending order", async () => {
      const confirmedOrder: Order = {
        id: "order-1",
        items: [],
        total: 29.99,
        status: "confirmed",
        createdAt: "2025-01-01T00:00:00Z",
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce(confirmedOrder);

      await expect(service.cancelOrder("order-1")).rejects.toThrow(
        'Cannot cancel order in "confirmed" status'
      );

      // Refund should never be attempted
      expect(httpClient.post).not.toHaveBeenCalled();
    });

    it("should handle refund failure during cancellation", async () => {
      const pendingOrder: Order = {
        id: "order-1",
        items: [],
        total: 29.99,
        status: "pending",
        createdAt: "2025-01-01T00:00:00Z",
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce(pendingOrder);
      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: false,
        error: "Refund service unavailable",
      } satisfies PaymentResult);

      await expect(service.cancelOrder("order-1")).rejects.toThrow(
        "Refund failed: Refund service unavailable"
      );

      expect(logger.error).toHaveBeenCalledWith(
        "Refund failed",
        expect.objectContaining({ error: "Refund service unavailable" })
      );
    });
  });
});
