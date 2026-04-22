import { ShoppingCart } from "../ShoppingCart";

const apple = { id: "apple", name: "Apple", price: 1.5 };
const banana = { id: "banana", name: "Banana", price: 0.75 };
const orange = { id: "orange", name: "Orange", price: 2.0 };

describe("ShoppingCart", () => {
  let cart: ShoppingCart;

  // Fresh cart for every test -- no shared mutable state
  beforeEach(() => {
    cart = new ShoppingCart();
  });

  it("should start empty", () => {
    expect(cart.isEmpty()).toBe(true);
    expect(cart.getItemCount()).toBe(0);
    expect(cart.getTotal()).toBe(0);
  });

  it("should add an item", () => {
    cart.addItem(apple);

    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0].name).toBe("Apple");
    expect(cart.getItems()[0].quantity).toBe(1);
  });

  it("should calculate total for one item", () => {
    cart.addItem(apple);

    expect(cart.getTotal()).toBe(1.5);
  });

  it("should add multiple items", () => {
    cart.addItem(apple);
    cart.addItem(banana, 3);

    expect(cart.getItems()).toHaveLength(2);
    expect(cart.getItemCount()).toBe(4);
  });

  it("should increase quantity of existing item", () => {
    cart.addItem(apple);
    cart.addItem(apple, 2);

    const appleItem = cart.getItems().find((i) => i.id === "apple");
    expect(appleItem?.quantity).toBe(3);
  });

  it("should update item quantity", () => {
    cart.addItem(banana, 3);
    cart.updateQuantity("banana", 1);

    const bananaItem = cart.getItems().find((i) => i.id === "banana");
    expect(bananaItem?.quantity).toBe(1);
  });

  it("should remove item when quantity set to zero", () => {
    cart.addItem(banana, 2);
    cart.updateQuantity("banana", 0);

    expect(cart.getItems().find((i) => i.id === "banana")).toBeUndefined();
    expect(cart.isEmpty()).toBe(true);
  });

  it("should remove item", () => {
    cart.addItem(apple);
    cart.addItem(orange);
    cart.removeItem("orange");

    expect(cart.getItems().find((i) => i.id === "orange")).toBeUndefined();
    expect(cart.getItems()).toHaveLength(1);
  });

  it("should calculate total correctly with multiple items", () => {
    cart.addItem(apple, 3);
    cart.addItem(banana, 2);

    expect(cart.getTotal()).toBe(6);
  });

  it("should clear all items", () => {
    cart.addItem(apple);
    cart.addItem(banana);
    cart.addItem(orange);
    cart.clear();

    expect(cart.isEmpty()).toBe(true);
    expect(cart.getTotal()).toBe(0);
  });
});
