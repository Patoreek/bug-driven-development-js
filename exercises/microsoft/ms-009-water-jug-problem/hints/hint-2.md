# Hint 2: Technique

This problem is related to **Bezout's identity** from number theory. Bezout's identity states:

> For any integers `x` and `y`, the smallest positive integer that can be expressed as `ax + by` (for integer a, b) is `gcd(x, y)`.

The jug operations correspond to adding and subtracting multiples of x and y. Therefore, `z` is achievable if and only if `z` is a multiple of `gcd(x, y)` (and `z <= x + y`).

You need to implement the **Euclidean algorithm** to compute GCD efficiently.
