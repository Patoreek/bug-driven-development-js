# Hint 1 (Mild)

Look at the top of the test file. There's a single `const cart = new ShoppingCart()` shared by all tests. Each test adds items to it and expects the accumulated state. What happens if you run just the third test? It expects a total of $1.50, but the cart is empty because tests 1 and 2 didn't run first.
