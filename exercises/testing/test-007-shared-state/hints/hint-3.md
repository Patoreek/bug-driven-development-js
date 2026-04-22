# Hint 3 (Strong)

Here's the pattern:

```ts
describe("ShoppingCart", () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  it("should start empty", () => {
    expect(cart.isEmpty()).toBe(true);
  });

  it("should calculate total for one item", () => {
    cart.addItem(apple);            // Set up within the test
    expect(cart.getTotal()).toBe(1.5);
  });

  it("should increase quantity of existing item", () => {
    cart.addItem(apple);            // Set up within the test
    cart.addItem(apple, 2);         // Act within the test
    const item = cart.getItems().find(i => i.id === "apple");
    expect(item?.quantity).toBe(3);
  });
});
```

Each test follows **Arrange-Act-Assert**: set up its own state, perform the action, check the result.
