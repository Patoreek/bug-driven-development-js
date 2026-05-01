// OPTIMAL: GCD approach using Bezout's identity — O(log(min(x,y))) time, O(1) space
export function canMeasureWater(x: number, y: number, z: number): boolean {
  if (z === 0) return true;
  if (x + y < z) return false;
  if (x === 0) return z === y;
  if (y === 0) return z === x;

  return z % gcd(x, y) === 0;
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
