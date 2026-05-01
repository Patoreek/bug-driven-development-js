import { describe, it, expect } from "vitest";
import {
  mergeKLists,
  arrayToList,
  listToArray,
  ListNode,
} from "../solution";

describe("mergeKLists", () => {
  it("should merge [[1,4,5],[1,3,4],[2,6]] into [1,1,2,3,4,4,5,6]", () => {
    const lists = [
      arrayToList([1, 4, 5]),
      arrayToList([1, 3, 4]),
      arrayToList([2, 6]),
    ];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([1, 1, 2, 3, 4, 4, 5, 6]);
  });

  it("should handle empty input array", () => {
    const result = mergeKLists([]);
    expect(result).toBeNull();
  });

  it("should handle single list", () => {
    const lists = [arrayToList([1, 2, 3])];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([1, 2, 3]);
  });

  it("should handle two lists", () => {
    const lists = [arrayToList([1, 3, 5]), arrayToList([2, 4, 6])];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should handle lists of different lengths", () => {
    const lists = [
      arrayToList([1]),
      arrayToList([2, 3, 4, 5, 6]),
      arrayToList([7, 8]),
    ];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("should handle lists with duplicates", () => {
    const lists = [
      arrayToList([1, 1, 1]),
      arrayToList([1, 1, 1]),
      arrayToList([1, 1, 1]),
    ];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it("should handle all empty lists", () => {
    const lists = [null, null, null];
    const result = mergeKLists(lists);
    expect(result).toBeNull();
  });

  it("should handle mix of empty and non-empty lists", () => {
    const lists = [null, arrayToList([1, 3]), null, arrayToList([2, 4])];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should handle negative values", () => {
    const lists = [
      arrayToList([-5, -3, -1]),
      arrayToList([-4, -2, 0]),
      arrayToList([-6, 1, 2]),
    ];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([-6, -5, -4, -3, -2, -1, 0, 1, 2]);
  });

  it("should handle single-element lists", () => {
    const lists = [
      arrayToList([5]),
      arrayToList([3]),
      arrayToList([7]),
      arrayToList([1]),
    ];
    const result = listToArray(mergeKLists(lists));
    expect(result).toEqual([1, 3, 5, 7]);
  });

  it("should complete within time limit for large input (performance test)", () => {
    // Create 2000 sorted lists, each with 1000 nodes (2M total nodes)
    // Sequential O(kN): ~2000 * 2000000 = 4 billion comparisons
    // Divide-and-conquer O(N log k): ~2000000 * 11 = 22M comparisons
    const k = 2000;
    const nodesPerList = 1000;
    const lists: (ListNode | null)[] = [];

    for (let i = 0; i < k; i++) {
      const arr: number[] = [];
      for (let j = 0; j < nodesPerList; j++) {
        arr.push(i * nodesPerList + j);
      }
      lists.push(arrayToList(arr));
    }

    const start = performance.now();
    const result = mergeKLists(lists);
    const elapsed = performance.now() - start;

    // Verify correctness: first and last values
    expect(result).not.toBeNull();
    expect(result!.val).toBe(0);

    // Count total nodes
    let count = 0;
    let node = result;
    while (node) {
      count++;
      node = node.next;
    }
    expect(count).toBe(k * nodesPerList);

    // The divide-and-conquer approach should finish well under 2000ms.
    // The sequential approach takes many seconds on this input size.
    expect(elapsed).toBeLessThan(2000);
  });
});
