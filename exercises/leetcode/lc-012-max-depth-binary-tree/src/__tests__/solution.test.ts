import { describe, it, expect } from "vitest";
import { maxDepth, arrayToTree } from "../solution";

describe("maxDepth", () => {
  it("should return 3 for a balanced tree [3,9,20,null,null,15,7]", () => {
    const root = arrayToTree([3, 9, 20, null, null, 15, 7]);
    expect(maxDepth(root)).toBe(3);
  });

  it("should return 0 for null (empty tree)", () => {
    expect(maxDepth(null)).toBe(0);
  });

  it("should return 1 for a single node", () => {
    const root = arrayToTree([1]);
    expect(maxDepth(root)).toBe(1);
  });

  it("should return 2 for [1,null,2]", () => {
    const root = arrayToTree([1, null, 2]);
    expect(maxDepth(root)).toBe(2);
  });

  it("should handle skewed tree (all left children)", () => {
    // Tree: 1 -> 2 -> 3 -> 4 (all left)
    const root = arrayToTree([1, 2, null, 3, null, 4]);
    expect(maxDepth(root)).toBe(4);
  });

  it("should handle skewed tree (all right children)", () => {
    // Tree: 1 -> 2 -> 3 (all right)
    const root = arrayToTree([1, null, 2, null, 3]);
    expect(maxDepth(root)).toBe(3);
  });

  it("should handle a complete binary tree of depth 4", () => {
    // Complete tree: depth 4, 15 nodes
    const root = arrayToTree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    expect(maxDepth(root)).toBe(4);
  });

  it("should handle unbalanced tree where left is deeper", () => {
    // Left subtree depth 3, right subtree depth 1
    const root = arrayToTree([1, 2, 3, 4, null, null, null, 5]);
    expect(maxDepth(root)).toBe(4);
  });

  it("should handle tree with two children only at root", () => {
    const root = arrayToTree([1, 2, 3]);
    expect(maxDepth(root)).toBe(2);
  });
});
