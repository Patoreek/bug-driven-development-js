/**
 * Top K Frequent Elements
 *
 * Given an integer array `nums` and an integer `k`, return the `k`
 * most frequent elements. You may return the answer in any order.
 *
 * Current approach: Count frequencies with a Map, then sort all unique
 * elements by frequency — O(n log n) due to sorting.
 *
 * Target: O(n) using bucket sort by frequency.
 */

export function topKFrequent(nums: number[], k: number): number[] {
  // Step 1: Count frequencies — O(n)
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) ?? 0) + 1);
  }

  // Step 2: Sort all unique elements by frequency — O(n log n)
  // This is the bottleneck
  const sorted = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);

  // Step 3: Take first k elements
  return sorted.slice(0, k).map(([num]) => num);
}
