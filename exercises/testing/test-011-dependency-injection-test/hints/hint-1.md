# Hint 1 -- Mild

Look at the `OrderService` constructor. It accepts an `HttpClient` and a `Logger` -- both are interfaces. You don't need real implementations of these interfaces to test `OrderService`. You just need objects that satisfy the interface shape.

Think about what's causing the flakiness: random delays, random failures, and shared state between tests. How can you eliminate all three?
