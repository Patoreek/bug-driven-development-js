import { describe, it, expect } from "vitest";
import { levelOrder, arrayToTree } from "../solution";

describe("levelOrder", () => {
  it("should return [[3],[9,20],[15,7]] for [3,9,20,null,null,15,7]", () => {
    const root = arrayToTree([3, 9, 20, null, null, 15, 7]);
    expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]]);
  });

  it("should return [[1]] for a single node", () => {
    const root = arrayToTree([1]);
    expect(levelOrder(root)).toEqual([[1]]);
  });

  it("should return [] for an empty tree", () => {
    expect(levelOrder(null)).toEqual([]);
  });

  it("should handle left-skewed tree", () => {
    // 1 -> 2 -> 3 (all left children)
    const root = arrayToTree([1, 2, null, 3]);
    expect(levelOrder(root)).toEqual([[1], [2], [3]]);
  });

  it("should handle right-skewed tree", () => {
    const root = arrayToTree([1, null, 2, null, 3]);
    expect(levelOrder(root)).toEqual([[1], [2], [3]]);
  });

  it("should handle complete binary tree", () => {
    const root = arrayToTree([1, 2, 3, 4, 5, 6, 7]);
    expect(levelOrder(root)).toEqual([[1], [2, 3], [4, 5, 6, 7]]);
  });

  it("should handle tree with gaps (sparse tree)", () => {
    // Tree:     1
    //          / \
    //         2   3
    //          \
    //           5
    const root = arrayToTree([1, 2, 3, null, 5]);
    expect(levelOrder(root)).toEqual([[1], [2, 3], [5]]);
  });

  it("should preserve left-to-right order within each level", () => {
    const root = arrayToTree([1, 2, 3, 4, 5, 6, 7]);
    const result = levelOrder(root);
    // Each level should be in left-to-right order
    expect(result[0]).toEqual([1]);
    expect(result[1]).toEqual([2, 3]);
    expect(result[2]).toEqual([4, 5, 6, 7]);
  });

  it("should have correct number of levels", () => {
    const root = arrayToTree([3, 9, 20, null, null, 15, 7]);
    const result = levelOrder(root);
    expect(result.length).toBe(3);
  });

  it("should handle negative values", () => {
    const root = arrayToTree([-10, -20, -30]);
    expect(levelOrder(root)).toEqual([[-10], [-20, -30]]);
  });
});
