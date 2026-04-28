import { describe, it, expect } from "vitest";
import {
  reverseList,
  arrayToList,
  listToArray,
  ListNode,
} from "../solution";

describe("reverseList", () => {
  it("should reverse [1,2,3,4,5] to [5,4,3,2,1]", () => {
    const head = arrayToList([1, 2, 3, 4, 5]);
    const reversed = reverseList(head);
    expect(listToArray(reversed)).toEqual([5, 4, 3, 2, 1]);
  });

  it("should reverse [1,2] to [2,1]", () => {
    const head = arrayToList([1, 2]);
    const reversed = reverseList(head);
    expect(listToArray(reversed)).toEqual([2, 1]);
  });

  it("should handle single node", () => {
    const head = arrayToList([1]);
    const reversed = reverseList(head);
    expect(listToArray(reversed)).toEqual([1]);
  });

  it("should handle empty list", () => {
    const reversed = reverseList(null);
    expect(reversed).toBeNull();
  });

  it("should reverse [1,2,3] to [3,2,1]", () => {
    const head = arrayToList([1, 2, 3]);
    const reversed = reverseList(head);
    expect(listToArray(reversed)).toEqual([3, 2, 1]);
  });

  it("should reverse in place (not create new nodes)", () => {
    // Create nodes and track their references
    const node3 = new ListNode(3);
    const node2 = new ListNode(2, node3);
    const node1 = new ListNode(1, node2);

    const reversed = reverseList(node1);

    // The same node objects should be reused, just relinked
    // After reversal: node3 -> node2 -> node1
    expect(reversed).toBe(node3); // node3 is the new head
    expect(node3.next).toBe(node2);
    expect(node2.next).toBe(node1);
    expect(node1.next).toBeNull();
  });

  it("should handle list with duplicate values", () => {
    const head = arrayToList([1, 1, 2, 2, 3]);
    const reversed = reverseList(head);
    expect(listToArray(reversed)).toEqual([3, 2, 2, 1, 1]);
  });
});
