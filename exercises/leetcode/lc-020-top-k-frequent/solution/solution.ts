/**
 * Top K Frequent Elements — Optimal Solution
 *
 * Bucket sort by frequency: O(n) time, O(n) space.
 *
 * Create an array of buckets where index = frequency.
 * Since no element can appear more than n times, the array
 * is at most size n+1. Walk from highest bucket down,
 * collecting elements until we have k.
 */

export function topKFrequent(nums: number[], k: number): number[] {
  // Step 1: Count frequencies — O(n)
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) ?? 0) + 1);
  }

  // Step 2: Bucket sort — O(n)
  // buckets[i] = list of numbers that appear exactly i times
  const buckets: number[][] = new Array(nums.length + 1);
  for (let i = 0; i <= nums.length; i++) {
    buckets[i] = [];
  }

  for (const [num, freq] of freqMap) {
    buckets[freq].push(num);
  }

  // Step 3: Walk buckets from highest frequency down — O(n)
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }

  return result;
}
