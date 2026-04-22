# Explanation: Shared Mutable State Between Tests

## Why the Tests Were Flawed

The original tests shared a single `ShoppingCart` instance across all test cases. Each test mutated this shared cart and expected the cumulative result. This creates **order-dependent tests** -- they only pass when executed in a specific sequence, and fail unpredictably when:

- A test is run in isolation (e.g., `it.only`)
- The test runner shuffles execution order (Vitest can do this with `--sequence.shuffle`)
- A new test is inserted in the middle of the file
- A test is removed or skipped

This is one of the most common causes of "flaky tests" in CI pipelines.

## What Was Wrong

```ts
// BEFORE: Shared mutable state
const cart = new ShoppingCart(); // One instance for all tests

it("should start empty", () => {
  expect(cart.isEmpty()).toBe(true); // Only works if this runs first
});

it("should add an item", () => {
  cart.addItem(apple); // Mutates the shared cart
  expect(cart.getItems()).toHaveLength(1);
});

it("should calculate total for one item", () => {
  // Assumes the apple from the previous test is still there
  expect(cart.getTotal()).toBe(1.5);
});
```

Key issues:
1. **No test isolation** -- each test relies on prior tests' side effects
2. **Fragile ordering** -- moving tests around breaks them
3. **Misleading failures** -- "should start empty" fails because of a completely different test
4. **Can't run in parallel** -- shared state prevents parallelization

## The Fix

```ts
// AFTER: Fresh state per test
describe("ShoppingCart", () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart(); // New instance for every test
  });

  it("should start empty", () => {
    expect(cart.isEmpty()).toBe(true); // Always works
  });

  it("should calculate total for one item", () => {
    cart.addItem(apple); // Each test sets up its own state
    expect(cart.getTotal()).toBe(1.5);
  });
});
```

Each test now follows the **Arrange-Act-Assert** pattern:
1. **Arrange** -- set up the specific state needed (fresh cart + relevant items)
2. **Act** -- perform the action being tested
3. **Assert** -- check the result

## The Principle

**Every test should be a self-contained unit.** It should:
- Set up its own preconditions
- Not depend on any other test's execution
- Not leave side effects that affect other tests
- Pass when run alone and when run with the full suite

## Interview Context

This is a fundamental testing concept:
- "Why are your tests failing intermittently in CI?"
- "What does 'test isolation' mean?"
- "How do you debug a test that passes locally but fails in CI?"

The answer often involves shared state. The fix is always the same: create fresh instances in `beforeEach` and make each test self-sufficient.
