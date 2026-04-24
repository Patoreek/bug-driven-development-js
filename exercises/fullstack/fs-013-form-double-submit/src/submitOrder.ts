// BUG: Server action that creates duplicate orders because it has no idempotency check

export interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

// Simulated order store
const orders: Array<{ id: string; product: string; quantity: number; idempotencyKey?: string }> = [];

export function getOrders() {
  return [...orders];
}

export function resetOrders() {
  orders.length = 0;
}

let orderCounter = 0;

// BUG: No idempotency check — every call creates a new order,
// even if it's a duplicate submission from the same form interaction
export function submitOrder(formData: FormData): OrderResult {
  const product = formData.get("product") as string;
  const quantity = Number(formData.get("quantity"));

  if (!product || !quantity || quantity < 1) {
    return { success: false, error: "Invalid order data" };
  }

  // BUG: The idempotency key from formData is completely ignored
  // const idempotencyKey = formData.get("idempotencyKey") as string;

  orderCounter++;
  const orderId = `order-${orderCounter}`;

  orders.push({ id: orderId, product, quantity });

  return { success: true, orderId };
}
