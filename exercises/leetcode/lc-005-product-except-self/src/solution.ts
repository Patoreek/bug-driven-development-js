/**
 * Product of Array Except Self
 *
 * Given an integer array `nums`, return an array `answer` such that
 * `answer[i]` is equal to the product of all elements of `nums`
 * except `nums[i]`.
 *
 * You must solve it WITHOUT using division.
 *
 * Current approach: Brute force O(n^2) — for each element, multiply
 * all other elements using a nested loop.
 *
 * Target: O(n) time, O(1) extra space (output array doesn't count).
 */
export function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result: number[] = new Array(n);

  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        product *= nums[j];
      }
    }
    result[i] = product;
  }

  return result;
}
