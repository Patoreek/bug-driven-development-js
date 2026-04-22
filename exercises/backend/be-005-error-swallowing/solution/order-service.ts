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

// Custom error classes for different failure types
class OrderError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "OrderError";
  }
}

class ValidationError extends OrderError {
  constructor(message: string, code: string) {
    super(message, code, 400);
    this.name = "ValidationError";
  }
}

class NotFoundError extends OrderError {
  constructor(message: string) {
    super(message, "PRODUCT_NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

class OutOfStockError extends OrderError {
  constructor(message: string) {
    super(message, "OUT_OF_STOCK", 409);
    this.name = "OutOfStockError";
  }
}

class PaymentError extends OrderError {
  constructor(message: string, code: string, statusCode: number) {
    super(message, code, statusCode);
    this.name = "PaymentError";
  }
}

// Simulated inventory database
const inventory: Record<string, number> = {
  "prod-1": 10,
  "prod-2": 0,
  "prod-3": 5,
};

function chargePayment(amount: number): boolean {
  if (amount <= 0) {
    throw new PaymentError(
      "Invalid payment amount",
      "INVALID_PAYMENT",
      400
    );
  }
  if (amount > 1000) {
    throw new PaymentError(
      "Payment declined: exceeds limit",
      "PAYMENT_DECLINED",
      402
    );
  }
  return true;
}

function checkInventory(productId: string, quantity: number): void {
  if (!(productId in inventory)) {
    throw new NotFoundError(`Product ${productId} not found`);
  }
  if (inventory[productId] < quantity) {
    throw new OutOfStockError(
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
    if (!items || items.length === 0) {
      throw new ValidationError("No items in order", "EMPTY_ORDER");
    }

    for (const item of items) {
      checkInventory(item.productId, item.quantity);
    }

    chargePayment(paymentAmount);

    const orderId = `order-${nextOrderId++}`;

    return {
      status: 200,
      body: { orderId },
    };
  } catch (e) {
    if (e instanceof OrderError) {
      return {
        status: e.statusCode,
        body: {
          error: e.message,
          code: e.code,
        },
      };
    }

    // Truly unexpected errors get a 500, but still include the message
    return {
      status: 500,
      body: {
        error: e instanceof Error ? e.message : "Unknown error",
        code: "INTERNAL_ERROR",
      },
    };
  }
}
