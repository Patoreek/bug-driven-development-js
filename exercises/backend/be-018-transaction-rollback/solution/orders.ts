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
 * Takes a snapshot of the current database state for rollback.
 */
function snapshotState(): {
  ordersSnapshot: Map<string, Order>;
  inventorySnapshot: Map<string, InventoryRecord>;
  notificationsSnapshot: Notification[];
  orderCounterSnapshot: number;
} {
  // Deep copy orders
  const ordersSnapshot = new Map<string, Order>();
  for (const [key, value] of orders) {
    ordersSnapshot.set(key, { ...value, items: [...value.items] });
  }

  // Deep copy inventory
  const inventorySnapshot = new Map<string, InventoryRecord>();
  for (const [key, value] of inventory) {
    inventorySnapshot.set(key, { ...value });
  }

  return {
    ordersSnapshot,
    inventorySnapshot,
    notificationsSnapshot: [...notifications],
    orderCounterSnapshot: orderCounter,
  };
}

/**
 * Restores database state from a snapshot.
 */
function restoreState(snapshot: {
  ordersSnapshot: Map<string, Order>;
  inventorySnapshot: Map<string, InventoryRecord>;
  notificationsSnapshot: Notification[];
  orderCounterSnapshot: number;
}): void {
  orders.clear();
  for (const [key, value] of snapshot.ordersSnapshot) {
    orders.set(key, value);
  }

  inventory.clear();
  for (const [key, value] of snapshot.inventorySnapshot) {
    inventory.set(key, value);
  }

  notifications.length = 0;
  notifications.push(...snapshot.notificationsSnapshot);

  orderCounter = snapshot.orderCounterSnapshot;
}

/**
 * Wraps a set of operations in a transaction.
 * If any operation fails, all changes are rolled back.
 */
export async function withTransaction<T>(
  fn: (tx: { rollback: () => void }) => Promise<T>
): Promise<T> {
  const snapshot = snapshotState();
  let shouldRollback = false;

  const tx = {
    rollback: () => {
      shouldRollback = true;
    },
  };

  try {
    const result = await fn(tx);
    if (shouldRollback) {
      restoreState(snapshot);
    }
    return result;
  } catch (error) {
    restoreState(snapshot);
    throw error;
  }
}

/**
 * Places an order: creates record, deducts inventory, sends notification.
 * All operations are wrapped in a transaction for atomicity.
 */
export async function placeOrder(
  userId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const orderId = await withTransaction(async () => {
      // Step 1: Create order
      const order = await createOrder(userId, items);

      // Step 2: Deduct inventory (may throw!)
      await deductInventory(items);

      // Step 3: Queue notification (may throw!)
      await queueNotification(userId, order.id);

      // Mark order as confirmed
      order.status = "confirmed";

      return order.id;
    });

    return { success: true, orderId };
  } catch (error) {
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
