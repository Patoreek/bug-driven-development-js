import { useState, useEffect } from "react";

// --- Simulated API functions ---

interface Order {
  id: string;
  product: string;
  amount: number;
  customerId: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface ShippingStatus {
  orderId: string;
  status: string;
  estimatedDelivery: string;
}

// Each fetch takes ~100ms (simulated)
let fetchTimestamps: number[] = [];

export function getFetchTimestamps() {
  return fetchTimestamps;
}

export function resetFetchTimestamps() {
  fetchTimestamps = [];
}

const FETCH_DELAY = 100;

export async function fetchOrder(orderId: string): Promise<Order> {
  const start = Date.now();
  await new Promise((r) => setTimeout(r, FETCH_DELAY));
  fetchTimestamps.push(Date.now() - start);
  return {
    id: orderId,
    product: "Wireless Headphones",
    amount: 79.99,
    customerId: "cust-42",
  };
}

export async function fetchCustomer(customerId: string): Promise<Customer> {
  const start = Date.now();
  await new Promise((r) => setTimeout(r, FETCH_DELAY));
  fetchTimestamps.push(Date.now() - start);
  return {
    id: customerId,
    name: "Alice Johnson",
    email: "alice@example.com",
  };
}

export async function fetchShippingStatus(orderId: string): Promise<ShippingStatus> {
  const start = Date.now();
  await new Promise((r) => setTimeout(r, FETCH_DELAY));
  fetchTimestamps.push(Date.now() - start);
  return {
    orderId,
    status: "In Transit",
    estimatedDelivery: "2026-04-25",
  };
}

// --- Component ---

export function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [shipping, setShipping] = useState<ShippingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      const start = Date.now();
      setLoading(true);

      // FIX: Fetch order first (needed by customer fetch), but start shipping in parallel
      const orderData = await fetchOrder(orderId);
      if (cancelled) return;
      setOrder(orderData);

      // Customer depends on order (needs customerId), but shipping only needs orderId
      // Run them in parallel
      const [customerData, shippingData] = await Promise.all([
        fetchCustomer(orderData.customerId),
        fetchShippingStatus(orderId),
      ]);
      if (cancelled) return;
      setCustomer(customerData);
      setShipping(shippingData);

      setTotalTime(Date.now() - start);
      setLoading(false);
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return <p data-testid="loading">Loading order details...</p>;
  }

  return (
    <div data-testid="order-details">
      <h2>Order Details</h2>

      {order && (
        <div data-testid="order-info">
          <p>Order: {order.id}</p>
          <p>Product: {order.product}</p>
          <p>Amount: ${order.amount}</p>
        </div>
      )}

      {customer && (
        <div data-testid="customer-info">
          <p>Customer: {customer.name}</p>
          <p>Email: {customer.email}</p>
        </div>
      )}

      {shipping && (
        <div data-testid="shipping-info">
          <p>Status: {shipping.status}</p>
          <p>ETA: {shipping.estimatedDelivery}</p>
        </div>
      )}

      <p data-testid="load-time">Loaded in {totalTime}ms</p>
    </div>
  );
}
