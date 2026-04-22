// BUG: This service catches all errors and returns generic "Something went wrong"
// messages, making it impossible to debug or give users useful feedback.

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface OrderResult {
  status: number;
  body: {
    orderId?: string;
    error?: string;
    code?: string;
  };
}

// Simulated inventory database
const inventory: Record<string, number> = {
  "prod-1": 10,
  "prod-2": 0,
  "prod-3": 5,
};

// Simulated payment processing
function chargePayment(amount: number): boolean {
  if (amount > 1000) {
    throw new Error("Payment declined: exceeds limit");
  }
  if (amount <= 0) {
    throw new Error("Invalid payment amount");
  }
  return true;
}

function checkInventory(productId: string, quantity: number): void {
  if (!(productId in inventory)) {
    throw new Error(`Product ${productId} not found`);
  }
  if (inventory[productId] < quantity) {
    throw new Error(
      `Insufficient stock for ${productId}: requested ${quantity}, available ${inventory[productId]}`
    );
  }
}

let nextOrderId = 1;

export async function processOrder(
  items: OrderItem[],
  paymentAmount: number
): Promise<OrderResult> {
  try {
    // Validate items
    if (!items || items.length === 0) {
      throw new Error("No items in order");
    }

    // Check inventory for each item
    for (const item of items) {
      checkInventory(item.productId, item.quantity);
    }

    // Process payment
    chargePayment(paymentAmount);

    // Create order
    const orderId = `order-${nextOrderId++}`;

    return {
      status: 200,
      body: { orderId },
    };
  } catch (e) {
    // BUG: All errors are swallowed with the same generic message
    // We lose the original error details entirely
    return {
      status: 500,
      body: { error: "Something went wrong" },
    };
  }
}
