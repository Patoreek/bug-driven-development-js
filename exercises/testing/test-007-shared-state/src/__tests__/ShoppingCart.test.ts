import { ShoppingCart } from "../ShoppingCart";

// BUG: All tests share a single cart instance. Tests depend on the order
// they run in and on the side effects of previous tests. Running a single
// test in isolation gives different results than running the full suite.

const cart = new ShoppingCart();

const apple = { id: "apple", name: "Apple", price: 1.5 };
const banana = { id: "banana", name: "Banana", price: 0.75 };
const orange = { id: "orange", name: "Orange", price: 2.0 };

describe("ShoppingCart", () => {
  it("should start empty", () => {
    // BUG: Only passes if this runs first -- later tests add items
    expect(cart.isEmpty()).toBe(true);
    expect(cart.getItemCount()).toBe(0);
  });

  it("should add an item", () => {
    cart.addItem(apple);

    // BUG: Depends on cart being empty from previous test
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0].name).toBe("Apple");
  });

  it("should calculate total for one item", () => {
    // BUG: Assumes exactly one apple from previous test
    expect(cart.getTotal()).toBe(1.5);
  });

  it("should add multiple items", () => {
    cart.addItem(banana, 3);

    // BUG: Cart has apple from earlier + 3 bananas now
    expect(cart.getItems()).toHaveLength(2);
    expect(cart.getItemCount()).toBe(4); // 1 apple + 3 bananas
  });

  it("should increase quantity of existing item", () => {
    cart.addItem(apple, 2);

    // BUG: Apple quantity is now 3 (1 from test 2 + 2 here)
    const appleItem = cart.getItems().find((i) => i.id === "apple");
    expect(appleItem?.quantity).toBe(3);
  });

  it("should update item quantity", () => {
    cart.updateQuantity("banana", 1);

    // BUG: Depends on banana having been added in test 4
    const bananaItem = cart.getItems().find((i) => i.id === "banana");
    expect(bananaItem?.quantity).toBe(1);
  });

  it("should remove item when quantity set to zero", () => {
    cart.updateQuantity("banana", 0);

    // BUG: Depends on banana existing from previous tests
    expect(cart.getItems().find((i) => i.id === "banana")).toBeUndefined();
  });

  it("should remove item", () => {
    cart.addItem(orange);
    cart.removeItem("orange");

    // BUG: Cart still has 3 apples from accumulated state
    expect(cart.getItems().find((i) => i.id === "orange")).toBeUndefined();
  });

  it("should calculate total correctly", () => {
    // BUG: Total depends on entire accumulated state (3 apples at $1.50)
    expect(cart.getTotal()).toBe(4.5);
  });

  it("should clear all items", () => {
    cart.clear();

    expect(cart.isEmpty()).toBe(true);
    expect(cart.getTotal()).toBe(0);
  });
});
