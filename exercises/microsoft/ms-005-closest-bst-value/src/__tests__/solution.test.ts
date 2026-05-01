import { describe, it, expect } from "vitest";
import { closestValue, arrayToTree, TreeNode } from "../solution";

describe("closestValue", () => {
  it("should find closest value in basic BST", () => {
    //       4
    //      / \
    //     2   5
    //    / \
    //   1   3
    const root = arrayToTree([4, 2, 5, 1, 3]);
    expect(closestValue(root, 3.7)).toBe(4);
  });

  it("should find closest when target is between two nodes", () => {
    const root = arrayToTree([4, 2, 5, 1, 3]);
    expect(closestValue(root, 2.4)).toBe(2);
  });

  it("should find exact match", () => {
    const root = arrayToTree([4, 2, 5, 1, 3]);
    expect(closestValue(root, 3)).toBe(3);
  });

  it("should handle single node tree", () => {
    const root = new TreeNode(1);
    expect(closestValue(root, 4.5)).toBe(1);
  });

  it("should handle target smaller than all values", () => {
    const root = arrayToTree([10, 5, 15, 3, 7]);
    expect(closestValue(root, 1)).toBe(3);
  });

  it("should handle target larger than all values", () => {
    const root = arrayToTree([10, 5, 15, 3, 7]);
    expect(closestValue(root, 100)).toBe(15);
  });

  it("should handle target equidistant from two nodes (returns either)", () => {
    // Target 2.5 is equidistant from 2 and 3
    const root = arrayToTree([4, 2, 5, 1, 3]);
    const result = closestValue(root, 2.5);
    expect([2, 3]).toContain(result);
  });

  it("should handle left-skewed tree", () => {
    // Build: 5 -> 4 -> 3 -> 2 -> 1 (left-skewed)
    const root = new TreeNode(5);
    root.left = new TreeNode(4);
    root.left.left = new TreeNode(3);
    root.left.left.left = new TreeNode(2);
    root.left.left.left.left = new TreeNode(1);
    expect(closestValue(root, 2.8)).toBe(3);
  });

  it("should handle right-skewed tree", () => {
    const root = new TreeNode(1);
    root.right = new TreeNode(2);
    root.right.right = new TreeNode(3);
    root.right.right.right = new TreeNode(4);
    root.right.right.right.right = new TreeNode(5);
    expect(closestValue(root, 3.2)).toBe(3);
  });

  it("should handle negative values", () => {
    const root = arrayToTree([0, -5, 5, -10, -3]);
    // -4 is equidistant from -5 and -3 (both distance 1), either is valid
    expect([-5, -3]).toContain(closestValue(root, -4));
  });

  it("should handle negative values with clear closest", () => {
    const root = arrayToTree([0, -5, 5, -10, -3]);
    expect(closestValue(root, -3.1)).toBe(-3);
  });

  it("should not allocate arrays for the search (performance test)", () => {
    // Build a right-skewed BST with 100,000 nodes (height = 100k)
    // The O(n) DFS approach allocates an array of 100k elements,
    // while the O(h) approach uses O(1) space.
    // With BST search, we go directly right, checking O(h) nodes.
    const root = new TreeNode(0);
    let current = root;
    for (let i = 1; i <= 100000; i++) {
      current.right = new TreeNode(i);
      current = current.right;
    }

    const start = performance.now();
    const result = closestValue(root, 99999.5);
    const elapsed = performance.now() - start;

    expect([99999, 100000]).toContain(result);
    // The BST-guided approach should be nearly instant on a skewed tree
    // when the target is near the end. The DFS approach must traverse all nodes.
    expect(elapsed).toBeLessThan(100);
  });
});
