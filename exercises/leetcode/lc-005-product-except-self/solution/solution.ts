/**
 * Product of Array Except Self — Optimal Solution
 *
 * Two-pass prefix/suffix product approach.
 * O(n) time, O(1) extra space (output array doesn't count).
 *
 * Pass 1 (left to right): result[i] = product of all elements to the left of i
 * Pass 2 (right to left): multiply result[i] by product of all elements to the right of i
 */
export function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n);

  // Pass 1: Fill result with left (prefix) products
  // result[i] = nums[0] * nums[1] * ... * nums[i-1]
  result[0] = 1;
  for (let i = 1; i < n; i++) {
    result[i] = result[i - 1] * nums[i - 1];
  }

  // Pass 2: Multiply by right (suffix) products
  // Accumulate suffix product in a running variable
  let rightProduct = 1;
  for (let i = n - 2; i >= 0; i--) {
    rightProduct *= nums[i + 1];
    result[i] *= rightProduct;
  }

  return result;
}
