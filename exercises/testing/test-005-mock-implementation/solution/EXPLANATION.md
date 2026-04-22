# Explanation: Over-Mocked Tests

## Why the Tests Were Flawed

The original tests mocked the module's own internal functions (`getTier`, `applyDiscount`, `calculateTax`) and then tested `calculateOrder`, which calls those functions. Since the real implementations were replaced with mocks that return hardcoded values, the tests were effectively verifying: "does calculateOrder pass through the values my mocks return?" That's a **tautological test** -- it can never fail because it tests the mock, not the code.

This is called **over-mocking** and it's one of the most insidious testing anti-patterns because the tests look thorough and pass reliably, but they provide zero confidence that the code works.

## What Was Wrong

```ts
// BEFORE: Mocking the module's own functions
vi.mock("../PricingCalculator", async () => {
  const actual = await vi.importActual("../PricingCalculator");
  return {
    ...actual,
    getTier: vi.fn().mockReturnValue({ name: "Standard", pricePerUnit: 29.99, ... }),
    applyDiscount: vi.fn().mockReturnValue(0),
    calculateTax: vi.fn().mockReturnValue(24.0),
  };
});

// This test passes even if the real getTier is completely broken:
const result = calculateOrder(5);
expect(result.tierName).toBe("Standard"); // comes from the mock, not real logic
expect(result.tax).toBe(24.0);            // comes from the mock, not real logic
```

Key issues:
1. **Circular testing** -- mock returns X, test asserts X
2. **Tier boundaries never tested** -- mock always returns the same tier
3. **Tax calculation never tested** -- mock returns a hardcoded 24.0
4. **Discount logic never tested** -- mock returns a hardcoded 0

## The Fix

```ts
// AFTER: Test real behavior with no mocks
const result = calculateOrder(5);
expect(result.tierName).toBe("Standard");
expect(result.subtotal).toBe(149.95);  // 5 * 29.99
expect(result.tax).toBe(12);           // real 8% tax
expect(result.total).toBe(161.95);     // real total
```

**When to mock:**
- External dependencies (network calls, databases, file system)
- Side effects (sending emails, logging to external services)
- Time-dependent code (Date.now, timers)

**When NOT to mock:**
- Pure functions in the same module
- Simple utility calculations
- Anything you can test with real inputs and outputs

## Interview Context

This is a senior-level testing question. Interviewers may ask:
- "When should you use mocks vs real implementations?"
- "What's the risk of over-mocking?"
- "How do you decide the boundary for what to mock?"

The rule of thumb: **mock at the boundary of your system, not inside it**. Mock the database driver, not the query builder. Mock the HTTP client, not the business logic that calls it.
