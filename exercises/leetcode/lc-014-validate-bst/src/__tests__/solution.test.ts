import { describe, it, expect } from "vitest";
import { isValidBST, TreeNode, arrayToTree } from "../solution";

describe("isValidBST", () => {
  it("should return true for a valid BST [2,1,3]", () => {
    const root = arrayToTree([2, 1, 3]);
    expect(isValidBST(root)).toBe(true);
  });

  it("should return false for [5,1,4,null,null,3,6] (deep violation)", () => {
    // The node 3 is in the right subtree of 5, but 3 < 5
    const root = arrayToTree([5, 1, 4, null, null, 3, 6]);
    expect(isValidBST(root)).toBe(false);
  });

  it("should return true for a single node", () => {
    const root = arrayToTree([1]);
    expect(isValidBST(root)).toBe(true);
  });

  it("should return true for null (empty tree)", () => {
    expect(isValidBST(null)).toBe(true);
  });

  it("should return false when left child equals parent (strict BST)", () => {
    //   1
    //  /
    // 1
    const root = new TreeNode(1, new TreeNode(1), null);
    expect(isValidBST(root)).toBe(false);
  });

  it("should return false when right child equals parent (strict BST)", () => {
    // 1
    //  \
    //   1
    const root = new TreeNode(1, null, new TreeNode(1));
    expect(isValidBST(root)).toBe(false);
  });

  it("should handle negative values in a valid BST", () => {
    //     0
    //    / \
    //  -3   9
    //  / \
    // -5  -1
    const root = arrayToTree([0, -3, 9, -5, -1]);
    expect(isValidBST(root)).toBe(true);
  });

  it("should catch deep violation on left side", () => {
    // This tree looks valid checking only immediate children:
    //       5
    //      / \
    //     3   8
    //    / \
    //   1   6     <-- 6 > 5, violates BST (should be < 5)
    const root = new TreeNode(
      5,
      new TreeNode(3, new TreeNode(1), new TreeNode(6)),
      new TreeNode(8)
    );
    expect(isValidBST(root)).toBe(false);
  });

  it("should return true for a valid sorted BST", () => {
    //       4
    //      / \
    //     2   6
    //    / \ / \
    //   1  3 5  7
    const root = arrayToTree([4, 2, 6, 1, 3, 5, 7]);
    expect(isValidBST(root)).toBe(true);
  });

  it("should handle large values", () => {
    const root = new TreeNode(
      2147483647,
      new TreeNode(-2147483648),
      null
    );
    expect(isValidBST(root)).toBe(true);
  });

  it("should return false for right subtree with value less than root", () => {
    //     10
    //    /  \
    //   5   15
    //       / \
    //      6  20    <-- 6 < 10, violates BST
    const root = new TreeNode(
      10,
      new TreeNode(5),
      new TreeNode(15, new TreeNode(6), new TreeNode(20))
    );
    expect(isValidBST(root)).toBe(false);
  });
});
