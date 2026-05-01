import { describe, it, expect } from "vitest";
import {
  inorderSuccessor,
  arrayToTree,
  findNode,
  TreeNode,
} from "../solution";

describe("inorderSuccessor", () => {
  it("should find successor in basic BST", () => {
    //       5
    //      / \
    //     3   6
    //    / \
    //   2   4
    //  /
    // 1
    const root = arrayToTree([5, 3, 6, 2, 4, null, null, 1]);
    const p = findNode(root, 4)!;
    const result = inorderSuccessor(root, p);
    expect(result).not.toBeNull();
    expect(result!.val).toBe(5);
  });

  it("should find successor when it is parent", () => {
    //     2
    //    /
    //   1
    const root = arrayToTree([2, 1]);
    const p = findNode(root, 1)!;
    const result = inorderSuccessor(root, p);
    expect(result).not.toBeNull();
    expect(result!.val).toBe(2);
  });

  it("should find successor as leftmost of right subtree", () => {
    //       20
    //      /  \
    //     9    25
    //    / \
    //   5   12
    //       / \
    //      11  14
    const root = arrayToTree([20, 9, 25, 5, 12, null, null, null, null, 11, 14]);
    const p = findNode(root, 9)!;
    const result = inorderSuccessor(root, p);
    expect(result).not.toBeNull();
    expect(result!.val).toBe(11);
  });

  it("should return null for largest element", () => {
    const root = arrayToTree([5, 3, 6, 2, 4]);
    const p = findNode(root, 6)!;
    const result = inorderSuccessor(root, p);
    expect(result).toBeNull();
  });

  it("should find successor of root", () => {
    //       5
    //      / \
    //     3   8
    //        / \
    //       6   10
    const root = arrayToTree([5, 3, 8, null, null, 6, 10]);
    const p = findNode(root, 5)!;
    const result = inorderSuccessor(root, p);
    expect(result).not.toBeNull();
    expect(result!.val).toBe(6);
  });

  it("should handle single node tree", () => {
    const root = new TreeNode(1);
    const result = inorderSuccessor(root, root);
    expect(result).toBeNull();
  });

  it("should find successor in left-skewed tree", () => {
    // 5 -> 4 -> 3 -> 2 -> 1 (left-skewed)
    // Inorder: 1, 2, 3, 4, 5
    const root = new TreeNode(5);
    root.left = new TreeNode(4);
    root.left.left = new TreeNode(3);
    root.left.left.left = new TreeNode(2);
    root.left.left.left.left = new TreeNode(1);

    const p = findNode(root, 3)!;
    const result = inorderSuccessor(root, p);
    expect(result).not.toBeNull();
    expect(result!.val).toBe(4);
  });

  it("should find successor of smallest element", () => {
    const root = arrayToTree([5, 3, 8, 1, 4]);
    const p = findNode(root, 1)!;
    const result = inorderSuccessor(root, p);
    expect(result).not.toBeNull();
    expect(result!.val).toBe(3);
  });

  it("should handle consecutive values", () => {
    //     3
    //    / \
    //   2   4
    //  /     \
    // 1       5
    const root = arrayToTree([3, 2, 4, 1, null, null, 5]);
    const p = findNode(root, 2)!;
    const result = inorderSuccessor(root, p);
    expect(result).not.toBeNull();
    expect(result!.val).toBe(3);
  });

  it("should not allocate arrays for the search (performance test)", () => {
    // Build a right-skewed BST: 1 -> 2 -> 3 -> ... -> 100000
    // The full inorder traversal collects all 100k nodes into an array.
    // The BST property approach walks O(h) nodes with O(1) space.
    const root = new TreeNode(1);
    let current = root;
    for (let i = 2; i <= 100000; i++) {
      current.right = new TreeNode(i);
      current = current.right;
    }

    // Find successor of 99998 (should be 99999)
    const p = new TreeNode(99998);

    const start = performance.now();
    const result = inorderSuccessor(root, p);
    const elapsed = performance.now() - start;

    expect(result).not.toBeNull();
    expect(result!.val).toBe(99999);
    // The BST approach should be nearly instant; the inorder traversal
    // must build an array of 100k nodes.
    expect(elapsed).toBeLessThan(100);
  });
});
