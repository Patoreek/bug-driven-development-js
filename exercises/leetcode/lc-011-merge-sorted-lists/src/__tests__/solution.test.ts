import { describe, it, expect } from "vitest";
import {
  mergeTwoLists,
  arrayToList,
  listToArray,
  ListNode,
} from "../solution";

describe("mergeTwoLists", () => {
  it("should merge [1,2,4] and [1,3,4] into [1,1,2,3,4,4]", () => {
    const l1 = arrayToList([1, 2, 4]);
    const l2 = arrayToList([1, 3, 4]);
    const result = listToArray(mergeTwoLists(l1, l2));
    expect(result).toEqual([1, 1, 2, 3, 4, 4]);
  });

  it("should handle empty + non-empty list", () => {
    const l1 = arrayToList([]);
    const l2 = arrayToList([0]);
    const result = listToArray(mergeTwoLists(l1, l2));
    expect(result).toEqual([0]);
  });

  it("should handle non-empty + empty list", () => {
    const l1 = arrayToList([1, 3, 5]);
    const l2 = arrayToList([]);
    const result = listToArray(mergeTwoLists(l1, l2));
    expect(result).toEqual([1, 3, 5]);
  });

  it("should handle both empty lists", () => {
    const result = listToArray(mergeTwoLists(null, null));
    expect(result).toEqual([]);
  });

  it("should handle one element each", () => {
    const l1 = arrayToList([2]);
    const l2 = arrayToList([1]);
    const result = listToArray(mergeTwoLists(l1, l2));
    expect(result).toEqual([1, 2]);
  });

  it("should handle lists of different lengths", () => {
    const l1 = arrayToList([1, 2, 3, 4, 5]);
    const l2 = arrayToList([6]);
    const result = listToArray(mergeTwoLists(l1, l2));
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should handle negative numbers", () => {
    const l1 = arrayToList([-3, -1, 0]);
    const l2 = arrayToList([-2, 2, 4]);
    const result = listToArray(mergeTwoLists(l1, l2));
    expect(result).toEqual([-3, -2, -1, 0, 2, 4]);
  });

  it("should handle duplicate values across lists", () => {
    const l1 = arrayToList([1, 1, 1]);
    const l2 = arrayToList([1, 1, 1]);
    const result = listToArray(mergeTwoLists(l1, l2));
    expect(result).toEqual([1, 1, 1, 1, 1, 1]);
  });

  it("should merge in-place without creating new nodes (O(1) extra space)", () => {
    const l1 = arrayToList([1, 3, 5]);
    const l2 = arrayToList([2, 4, 6]);

    // Collect original node references
    const originalNodes = new Set<ListNode>();
    let cur = l1;
    while (cur) {
      originalNodes.add(cur);
      cur = cur.next;
    }
    cur = l2;
    while (cur) {
      originalNodes.add(cur);
      cur = cur.next;
    }

    const merged = mergeTwoLists(l1, l2);

    // Walk merged list — every node should be one of the original nodes
    cur = merged;
    let nodeCount = 0;
    while (cur) {
      expect(originalNodes.has(cur)).toBe(true);
      nodeCount++;
      cur = cur.next;
    }
    expect(nodeCount).toBe(6);
  });
});
