export interface Order {
  id: string;
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  status: "pending" | "confirmed" | "failed";
  createdAt: number;
}

export interface InventoryRecord {
  productId: string;
  stock: number;
}

export interface Notification {
  userId: string;
  orderId: string;
  type: string;
}

// Simulated database tables
const orders = new Map<string, Order>();
const inventory = new Map<string, InventoryRecord>([
  ["prod-1", { productId: "prod-1", stock: 10 }],
  ["prod-2", { productId: "prod-2", stock: 5 }],
  ["prod-3", { productId: "prod-3", stock: 0 }],
]);
const notifications: Notification[] = [];

let orderCounter = 0;

// Pluggable failure simulators for testing
let inventoryFailure: string | null = null;
let notificationFailure: boolean = false;

export function setInventoryFailure(productId: string | null): void {
  inventoryFailure = productId;
}

export function setNotificationFailure(shouldFail: boolean): void {
  notificationFailure = shouldFail;
}

/**
 * Creates an order record in the database.
 */
async function createOrder(
  userId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<Order> {
  orderCounter++;
  const order: Order = {
    id: `order-${orderCounter}`,
    userId,
    items,
    status: "pending",
    createdAt: Date.now(),
  };
  orders.set(order.id, order);
  return order;
}

/**
 * Deducts inventory for the given items.
 * Throws if insufficient stock or if failure is simulated.
 */
async function deductInventory(
  items: Array<{ productId: string; quantity: number }>
): Promise<void> {
  for (const item of items) {
    if (inventoryFailure === item.productId) {
      throw new Error(`Inventory update failed for ${item.productId}`);
    }
    const record = inventory.get(item.productId);
    if (!record || record.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.productId}`);
    }
    record.stock -= item.quantity;
  }
}

/**
 * Queues a notification for the user.
 * Throws if notification service is down.
 */
async function queueNotification(
  userId: string,
  orderId: string
): Promise<void> {
  if (notificationFailure) {
    throw new Error("Notification service unavailable");
  }
  notifications.push({ userId, orderId, type: "order_confirmation" });
}

/**
 * Wraps a set of operations in a transaction.
 * If any operation fails, all changes should be rolled back.
 *
 * BUG: Not implemented — just runs the callback without transaction support.
 */
export async function withTransaction<T>(
  fn: (tx: { rollback: () => void }) => Promise<T>
): Promise<T> {
  // BUG: No snapshot, no rollback capability — just runs the function directly
  return fn({ rollback: () => {} });
}

/**
 * Places an order: creates record, deducts inventory, sends notification.
 *
 * BUG: Operations are not wrapped in a transaction — if step 2 or 3 fails,
 * step 1 is not rolled back, leaving the database inconsistent.
 */
export async function placeOrder(
  userId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Step 1: Create order
    const order = await createOrder(userId, items);

    // Step 2: Deduct inventory (may throw!)
    await deductInventory(items);

    // Step 3: Queue notification (may throw!)
    await queueNotification(userId, order.id);

    // Mark order as confirmed
    order.status = "confirmed";

    return { success: true, orderId: order.id };
  } catch (error) {
    // BUG: Order from step 1 is NOT rolled back!
    // BUG: Inventory from step 2 (if partially completed) is NOT rolled back!
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helpers for testing
export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}

export function getInventory(productId: string): InventoryRecord | undefined {
  return inventory.get(productId);
}

export function getNotifications(): Notification[] {
  return [...notifications];
}

export function resetDatabase(): void {
  orders.clear();
  inventory.clear();
  inventory.set("prod-1", { productId: "prod-1", stock: 10 });
  inventory.set("prod-2", { productId: "prod-2", stock: 5 });
  inventory.set("prod-3", { productId: "prod-3", stock: 0 });
  notifications.length = 0;
  orderCounter = 0;
  inventoryFailure = null;
  notificationFailure = false;
}
