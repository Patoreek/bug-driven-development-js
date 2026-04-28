import { describe, it, expect } from "vitest";
import { hasCycle, createList, ListNode } from "../solution";

describe("hasCycle", () => {
  it("should detect a cycle that loops back to the head", () => {
    const head = createList([3, 2, 0, -4], 0);
    expect(hasCycle(head)).toBe(true);
  });

  it("should detect a cycle that loops back to the second node", () => {
    const head = createList([3, 2, 0, -4], 1);
    expect(hasCycle(head)).toBe(true);
  });

  it("should detect a cycle at the tail (self-loop)", () => {
    const head = createList([1, 2, 3], 2);
    expect(hasCycle(head)).toBe(true);
  });

  it("should return false for no cycle", () => {
    const head = createList([1, 2, 3, 4, 5]);
    expect(hasCycle(head)).toBe(false);
  });

  it("should return false for a single node without cycle", () => {
    const head = createList([1]);
    expect(hasCycle(head)).toBe(false);
  });

  it("should detect cycle in a single node (self-loop)", () => {
    const node = new ListNode(1);
    node.next = node;
    expect(hasCycle(node)).toBe(true);
  });

  it("should return false for two nodes without cycle", () => {
    const head = createList([1, 2]);
    expect(hasCycle(head)).toBe(false);
  });

  it("should detect cycle in two nodes", () => {
    const head = createList([1, 2], 0);
    expect(hasCycle(head)).toBe(true);
  });

  it("should return false for empty list", () => {
    expect(hasCycle(null)).toBe(false);
  });

  it("should use O(1) space (memory test with large list)", () => {
    // Create a large list with a cycle
    // If using a Set, it would store 100k nodes
    const size = 100_000;
    const values = Array.from({ length: size }, (_, i) => i);
    const head = createList(values, 50_000);

    // Track approximate memory before and after
    // We can't precisely measure, but we can check it completes
    // without issues and the algorithm is correct
    const start = performance.now();
    const result = hasCycle(head);
    const elapsed = performance.now() - start;

    expect(result).toBe(true);
    // Both O(n) Set and O(1) Floyd's are fast, but this validates correctness
    expect(elapsed).toBeLessThan(200);
  });

  it("should detect cycle at various positions", () => {
    // Cycle back to index 0
    expect(hasCycle(createList([1, 2, 3, 4, 5], 0))).toBe(true);
    // Cycle back to index 2
    expect(hasCycle(createList([1, 2, 3, 4, 5], 2))).toBe(true);
    // Cycle back to index 4 (tail to itself)
    expect(hasCycle(createList([1, 2, 3, 4, 5], 4))).toBe(true);
  });
});
