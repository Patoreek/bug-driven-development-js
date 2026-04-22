# Hint 2 (Medium)

Use `beforeEach` to create a fresh `ShoppingCart` instance before every test. Declare `let cart: ShoppingCart` in the `describe` block, then assign `cart = new ShoppingCart()` inside `beforeEach`. Each test must then set up its own items -- if a test needs 3 apples, it must call `cart.addItem(apple, 3)` itself, not rely on previous tests having added them.
