# Hint 3 -- Strong

Here's the pattern for each test:

```typescript
beforeEach(() => {
  httpClient = { get: vi.fn(), post: vi.fn() };
  logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn() };
  service = new OrderService(httpClient, logger);
});

it("should create an order", async () => {
  // Mock product fetches
  vi.mocked(httpClient.get)
    .mockResolvedValueOnce({ id: "prod-1", name: "Widget", price: 29.99, stock: 10 });

  // Mock payment success
  vi.mocked(httpClient.post)
    .mockResolvedValueOnce({ success: true, transactionId: "txn-123" })
    .mockResolvedValueOnce({ id: "order-1", status: "confirmed", ... });

  const order = await service.createOrder(["prod-1"], quantities);

  expect(order.status).toBe("confirmed");
  expect(httpClient.get).toHaveBeenCalledWith("/api/products/prod-1");
  expect(httpClient.post).toHaveBeenCalledWith("/api/payments", expect.objectContaining({ total: 29.99 }));
});
```

For payment failure, simply mock the response:
```typescript
vi.mocked(httpClient.post).mockResolvedValueOnce({ success: false, error: "Card declined" });
await expect(service.createOrder(...)).rejects.toThrow("Payment failed: Card declined");
```
