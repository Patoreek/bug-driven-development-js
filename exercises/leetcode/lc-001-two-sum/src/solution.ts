/**
 * Two Sum
 *
 * Given an array of integers `nums` and an integer `target`,
 * return the indices of the two numbers that add up to `target`.
 *
 * You may assume that each input has exactly one solution,
 * and you may not use the same element twice.
 *
 * Current approach: Brute force O(n^2) — checks every pair.
 * Target: O(n) time, O(n) space.
 */
export function twoSum(nums: number[], target: number): [number, number] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  throw new Error("No two sum solution found");
}
