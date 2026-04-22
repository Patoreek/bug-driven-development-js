# Hint 3 (Strong)

Delete the `vi.mock` block entirely and test each function directly:

```ts
// Test getTier with real logic
expect(getTier(5).name).toBe("Standard");
expect(getTier(25).name).toBe("Bulk");
expect(getTier(100).name).toBe("Enterprise");

// Test calculateOrder end-to-end
const result = calculateOrder(5);
expect(result.subtotal).toBe(149.95); // 5 * 29.99
expect(result.tax).toBe(12);          // 149.95 * 0.08, rounded
expect(result.total).toBe(161.95);    // 149.95 + 12.00

// Test with a discount
const discount = { code: "SAVE10", percentage: 10, minOrderTotal: 100 };
const discounted = calculateOrder(5, discount);
expect(discounted.discount).toBe(15); // 10% of 149.95, rounded
```
