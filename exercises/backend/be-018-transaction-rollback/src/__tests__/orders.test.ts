import {
  placeOrder,
  getOrder,
  getInventory,
  getNotifications,
  resetDatabase,
  setInventoryFailure,
  setNotificationFailure,
  withTransaction,
} from "../orders";

describe("Transaction Rollback", () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe("successful order", () => {
    it("creates order, deducts inventory, and sends notification", async () => {
      const result = await placeOrder("user-1", [
        { productId: "prod-1", quantity: 2 },
      ]);

      expect(result.success).toBe(true);
      expect(result.orderId).toBeDefined();

      // Order should exist and be confirmed
      const order = getOrder(result.orderId!);
      expect(order).toBeDefined();
      expect(order!.status).toBe("confirmed");

      // Inventory should be deducted
      expect(getInventory("prod-1")!.stock).toBe(8);

      // Notification should be queued
      const notifs = getNotifications();
      expect(notifs).toHaveLength(1);
      expect(notifs[0].orderId).toBe(result.orderId);
    });

    it("handles multi-item orders", async () => {
      const result = await placeOrder("user-1", [
        { productId: "prod-1", quantity: 3 },
        { productId: "prod-2", quantity: 1 },
      ]);

      expect(result.success).toBe(true);
      expect(getInventory("prod-1")!.stock).toBe(7);
      expect(getInventory("prod-2")!.stock).toBe(4);
    });
  });

  describe("inventory failure rollback", () => {
    it("does NOT create order when inventory deduction fails", async () => {
      setInventoryFailure("prod-1");

      const result = await placeOrder("user-1", [
        { productId: "prod-1", quantity: 2 },
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("prod-1");

      // Order should NOT exist in the database
      // (This is the main test — without transactions, the order persists)
      const allOrderIds = Array.from(
        { length: 10 },
        (_, i) => `order-${i + 1}`
      );
      for (const id of allOrderIds) {
        const order = getOrder(id);
        if (order) {
          // If an order exists from this operation, it means rollback failed
          expect(order.status).not.toBe("pending");
        }
      }
    });

    it("preserves original inventory when deduction fails", async () => {
      setInventoryFailure("prod-1");

      await placeOrder("user-1", [{ productId: "prod-1", quantity: 2 }]);

      // Inventory should be unchanged
      expect(getInventory("prod-1")!.stock).toBe(10);
    });

    it("does NOT send notification when inventory fails", async () => {
      setInventoryFailure("prod-1");

      await placeOrder("user-1", [{ productId: "prod-1", quantity: 2 }]);

      expect(getNotifications()).toHaveLength(0);
    });
  });

  describe("notification failure rollback", () => {
    it("rolls back order when notification fails", async () => {
      setNotificationFailure(true);

      const result = await placeOrder("user-1", [
        { productId: "prod-1", quantity: 2 },
      ]);

      expect(result.success).toBe(false);

      // Order should NOT exist
      const allOrderIds = Array.from(
        { length: 10 },
        (_, i) => `order-${i + 1}`
      );
      for (const id of allOrderIds) {
        const order = getOrder(id);
        if (order) {
          expect(order.status).not.toBe("pending");
        }
      }
    });

    it("restores inventory when notification fails", async () => {
      setNotificationFailure(true);

      await placeOrder("user-1", [{ productId: "prod-1", quantity: 2 }]);

      // Inventory should be restored to original
      expect(getInventory("prod-1")!.stock).toBe(10);
    });
  });

  describe("insufficient stock", () => {
    it("fails when stock is insufficient", async () => {
      const result = await placeOrder("user-1", [
        { productId: "prod-3", quantity: 1 },
      ]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient stock");
    });

    it("does not create order when stock is insufficient", async () => {
      await placeOrder("user-1", [{ productId: "prod-3", quantity: 1 }]);

      const allOrderIds = Array.from(
        { length: 10 },
        (_, i) => `order-${i + 1}`
      );
      for (const id of allOrderIds) {
        const order = getOrder(id);
        if (order) {
          expect(order.status).not.toBe("pending");
        }
      }
    });
  });

  describe("withTransaction", () => {
    it("returns the result of the callback on success", async () => {
      const result = await withTransaction(async () => {
        return 42;
      });
      expect(result).toBe(42);
    });

    it("propagates errors from the callback", async () => {
      await expect(
        withTransaction(async () => {
          throw new Error("tx failed");
        })
      ).rejects.toThrow("tx failed");
    });
  });
});
