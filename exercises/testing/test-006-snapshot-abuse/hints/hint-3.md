# Hint 3 (Strong)

Here's the structure of the replacement tests:

```tsx
it("should display the product name and description", () => {
  render(<ProductCard {...props} />);
  expect(screen.getByRole("heading", { name: "Wireless Headphones" })).toBeInTheDocument();
  expect(screen.getByText("Premium noise-cancelling headphones")).toBeInTheDocument();
});

it("should display the formatted price", () => {
  render(<ProductCard {...props} />);
  expect(screen.getByText("$79.99")).toBeInTheDocument();
});

it("should show 'In Stock' when available", () => {
  render(<ProductCard {...props} inStock={true} />);
  expect(screen.getByLabelText("In stock")).toBeInTheDocument();
});

it("should show disabled button when out of stock", () => {
  render(<ProductCard {...props} inStock={false} />);
  expect(screen.getByRole("button", { name: "Out of Stock" })).toBeDisabled();
});

it("should call onAddToCart when clicked", async () => {
  const onAddToCart = vi.fn();
  render(<ProductCard {...props} onAddToCart={onAddToCart} />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Add to Cart" }));
  expect(onAddToCart).toHaveBeenCalledTimes(1);
});
```
