/**
 * Two Sum — Optimal Solution
 *
 * Single-pass hash map approach: O(n) time, O(n) space.
 *
 * For each number, compute its complement (target - num).
 * If the complement is already in the map, we found our pair.
 * Otherwise, store the current number and its index.
 */
export function twoSum(nums: number[], target: number): [number, number] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  throw new Error("No two sum solution found");
}
