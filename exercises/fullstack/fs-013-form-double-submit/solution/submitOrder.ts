export interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

const orders: Array<{ id: string; product: string; quantity: number; idempotencyKey?: string }> = [];

// FIX: Track processed idempotency keys to prevent duplicates
const processedKeys = new Map<string, string>(); // idempotencyKey -> orderId

export function getOrders() {
  return [...orders];
}

export function resetOrders() {
  orders.length = 0;
  processedKeys.clear();
}

let orderCounter = 0;

// FIX: Check idempotency key before creating a new order
export function submitOrder(formData: FormData): OrderResult {
  const product = formData.get("product") as string;
  const quantity = Number(formData.get("quantity"));
  const idempotencyKey = formData.get("idempotencyKey") as string;

  if (!product || !quantity || quantity < 1) {
    return { success: false, error: "Invalid order data" };
  }

  // FIX: If we've seen this idempotency key before, return the original order
  if (idempotencyKey && processedKeys.has(idempotencyKey)) {
    const existingOrderId = processedKeys.get(idempotencyKey)!;
    return { success: true, orderId: existingOrderId };
  }

  orderCounter++;
  const orderId = `order-${orderCounter}`;

  orders.push({ id: orderId, product, quantity, idempotencyKey });

  // FIX: Record the idempotency key
  if (idempotencyKey) {
    processedKeys.set(idempotencyKey, orderId);
  }

  return { success: true, orderId };
}
