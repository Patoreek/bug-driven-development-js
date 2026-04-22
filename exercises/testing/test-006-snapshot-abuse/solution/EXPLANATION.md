# Explanation: Snapshot Test Abuse

## Why the Tests Were Flawed

The original tests used `toMatchSnapshot()` on `container.innerHTML` to capture the entire HTML output of the component. While snapshot testing has legitimate uses (e.g., detecting unintended changes to serialized data), using it as the **sole** testing strategy for UI components creates several problems:

1. **Noise over signal** -- A single whitespace change breaks the snapshot, and the diff is a wall of HTML that nobody reads carefully
2. **Auto-update culture** -- Teams learn to run `vitest -u` reflexively, rubber-stamping any change
3. **No communication of intent** -- The test name says "renders in stock product" but the snapshot tests every single attribute, class, and element
4. **False confidence** -- Tests "cover" the component but don't verify specific behaviors

## What Was Wrong

```tsx
// BEFORE: Snapshot of entire HTML
it("should render a product that is in stock", () => {
  const { container } = render(<ProductCard ... />);
  expect(container.innerHTML).toMatchSnapshot();
});
```

This snapshot locks in:
- Every HTML tag and nesting level
- Every class name and attribute
- Every piece of text content
- Every style property

When any of these changes -- intentionally or not -- the snapshot breaks. Developers update it without reviewing, and real bugs slip through.

## The Fix

```tsx
// AFTER: Targeted, behavioral assertions
it("should display the product name and description", () => {
  render(<ProductCard {...props} />);
  expect(screen.getByRole("heading", { name: "Wireless Headphones" })).toBeInTheDocument();
  expect(screen.getByText("Premium noise-cancelling headphones")).toBeInTheDocument();
});

it("should show enabled Add to Cart button when in stock", () => {
  render(<ProductCard {...props} inStock={true} />);
  expect(screen.getByRole("button", { name: "Add to Cart" })).toBeEnabled();
});

it("should call onAddToCart when clicked", async () => {
  const onAddToCart = vi.fn();
  render(<ProductCard {...props} onAddToCart={onAddToCart} />);
  await user.click(screen.getByRole("button", { name: "Add to Cart" }));
  expect(onAddToCart).toHaveBeenCalledTimes(1);
});
```

Each test now:
- Tests **one specific behavior**
- Has a clear name that describes what it verifies
- Won't break from unrelated markup changes
- Fails for the right reasons -- when the feature is actually broken

## When Snapshots Are Appropriate

Snapshots work well for:
- **Serialized data** (API responses, configuration objects)
- **Small, stable outputs** (a formatted string, a CSS-in-JS style object)
- **Regression detection** as a supplement to behavioral tests, not a replacement

## Interview Context

Interviewers often ask about snapshot testing to gauge testing maturity:
- "What are the drawbacks of snapshot tests?"
- "When would you use a snapshot test vs. explicit assertions?"
- "How do you prevent snapshot tests from becoming rubber-stamped?"

The key answer: snapshots are a **change detection** tool, not a **correctness verification** tool. They tell you something changed, but not whether the change is correct.
