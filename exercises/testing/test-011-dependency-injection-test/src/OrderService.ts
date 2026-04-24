export interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, body: unknown): Promise<T>;
}

export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Order {
  id: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export class OrderService {
  constructor(
    private httpClient: HttpClient,
    private logger: Logger
  ) {}

  async createOrder(
    productIds: string[],
    quantities: Map<string, number>
  ): Promise<Order> {
    this.logger.info("Creating order", { productIds });

    // Fetch all products
    const products = await Promise.all(
      productIds.map((id) => this.httpClient.get<Product>(`/api/products/${id}`))
    );

    // Validate stock
    for (const product of products) {
      const qty = quantities.get(product.id) ?? 0;
      if (qty <= 0) {
        throw new Error(`Invalid quantity for product ${product.id}`);
      }
      if (product.stock < qty) {
        this.logger.warn("Insufficient stock", {
          productId: product.id,
          requested: qty,
          available: product.stock,
        });
        throw new Error(
          `Insufficient stock for "${product.name}": requested ${qty}, available ${product.stock}`
        );
      }
    }

    // Calculate total
    const items = products.map((product) => ({
      productId: product.id,
      quantity: quantities.get(product.id)!,
      price: product.price,
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Process payment
    const paymentResult = await this.httpClient.post<PaymentResult>(
      "/api/payments",
      { total, items }
    );

    if (!paymentResult.success) {
      this.logger.error("Payment failed", { error: paymentResult.error });
      throw new Error(`Payment failed: ${paymentResult.error}`);
    }

    // Create the order
    const order = await this.httpClient.post<Order>("/api/orders", {
      items,
      total,
      transactionId: paymentResult.transactionId,
    });

    this.logger.info("Order created successfully", { orderId: order.id });
    return order;
  }

  async getOrderStatus(orderId: string): Promise<Order> {
    this.logger.info("Fetching order status", { orderId });
    const order = await this.httpClient.get<Order>(`/api/orders/${orderId}`);
    return order;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    this.logger.info("Cancelling order", { orderId });

    const order = await this.httpClient.get<Order>(`/api/orders/${orderId}`);

    if (order.status !== "pending") {
      throw new Error(
        `Cannot cancel order in "${order.status}" status`
      );
    }

    const refundResult = await this.httpClient.post<PaymentResult>(
      "/api/payments/refund",
      { orderId }
    );

    if (!refundResult.success) {
      this.logger.error("Refund failed", { orderId, error: refundResult.error });
      throw new Error(`Refund failed: ${refundResult.error}`);
    }

    const cancelledOrder = await this.httpClient.post<Order>(
      `/api/orders/${orderId}/cancel`,
      {}
    );

    this.logger.info("Order cancelled", { orderId });
    return cancelledOrder;
  }
}
