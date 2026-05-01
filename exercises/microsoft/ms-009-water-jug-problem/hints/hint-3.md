# Hint 3: Implementation

The entire solution is just a few lines:

```typescript
function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
```

Then check:
1. If `z === 0`, return `true`
2. If `x + y < z`, return `false`
3. If `x === 0`, return `z === y`
4. If `y === 0`, return `z === x`
5. Otherwise: return `z % gcd(x, y) === 0`

Edge cases with `x === 0` or `y === 0` must be handled before the GCD check to avoid `gcd(0, y)` issues.
