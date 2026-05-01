import { describe, it, expect } from "vitest";
import { largestBSTSubtree, TreeNode, arrayToTree } from "../solution";

describe("largestBSTSubtree", () => {
  it("should return 0 for null tree", () => {
    expect(largestBSTSubtree(null)).toBe(0);
  });

  it("should return 1 for a single node", () => {
    const root = new TreeNode(1);
    expect(largestBSTSubtree(root)).toBe(1);
  });

  it("should return full size when entire tree is a BST", () => {
    //       4
    //      / \
    //     2   6
    //    / \ / \
    //   1  3 5  7
    const root = arrayToTree([4, 2, 6, 1, 3, 5, 7]);
    expect(largestBSTSubtree(root)).toBe(7);
  });

  it("should find BST subtree on the left", () => {
    //       10
    //      /  \
    //     5    15
    //    / \     \
    //   1   8    7   <-- 7 < 15, violates BST for right subtree
    const root = new TreeNode(10);
    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(1);
    root.left.right = new TreeNode(8);
    root.right.right = new TreeNode(7); // Invalid: 7 < 15

    // Left subtree [5,1,8] is a valid BST of size 3
    // Right subtree [15,null,7] is NOT valid
    // Full tree is NOT valid (because right subtree is invalid)
    expect(largestBSTSubtree(root)).toBe(3);
  });

  it("should find BST subtree on the right", () => {
    //       10
    //      /  \
    //     5   15
    //    / \  / \
    //   6  8 12 20
    // Left subtree: 5 has left=6, but 6 > 5, not a valid BST
    const root = new TreeNode(10);
    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(6); // Invalid: 6 > 5
    root.left.right = new TreeNode(8);
    root.right.left = new TreeNode(12);
    root.right.right = new TreeNode(20);

    // Right subtree [15,12,20] is a valid BST of size 3
    expect(largestBSTSubtree(root)).toBe(3);
  });

  it("should handle tree where only leaves are BSTs", () => {
    //       5
    //      / \
    //     2   8
    //    / \
    //   10  1   <-- both violate BST property for parent 2
    const root = new TreeNode(5);
    root.left = new TreeNode(2);
    root.right = new TreeNode(8);
    root.left.left = new TreeNode(10); // 10 > 2, invalid
    root.left.right = new TreeNode(1); // 1 < 2, invalid

    // Each leaf is a BST of size 1, node 8 is BST of size 1
    // Largest BST is size 1
    expect(largestBSTSubtree(root)).toBe(1);
  });

  it("should find a deeply nested BST subtree", () => {
    //         50
    //        /
    //       30
    //      /  \
    //     5   40     <-- subtree at 30 is valid BST (size 5)
    //    / \
    //   1  15
    // But 50 has no right child and left subtree has 30 < 50
    // so full tree rooted at 50 is actually a valid BST too (size 6)
    // Let's make the root invalid instead:
    //         20
    //        /
    //       30         <-- 30 > 20, invalid at root level
    //      /  \
    //     25   40
    //    / \
    //   22  28
    const root = new TreeNode(20);
    root.left = new TreeNode(30); // 30 > 20, violates BST
    root.left.left = new TreeNode(25);
    root.left.right = new TreeNode(40);
    root.left.left.left = new TreeNode(22);
    root.left.left.right = new TreeNode(28);

    // Subtree rooted at 30: [30, 25, 40, 22, 28]
    // Is it valid? 25 < 30 (ok), 40 > 30 (ok), 22 < 25 (ok), 28 > 25 and 28 < 30 (ok)
    // Yes! Size = 5
    expect(largestBSTSubtree(root)).toBe(5);
  });

  it("should handle the LeetCode example [10,5,15,1,8,null,7]", () => {
    //       10
    //      /  \
    //     5   15
    //    / \    \
    //   1   8    7
    const root = arrayToTree([10, 5, 15, 1, 8, null, 7]);
    // Subtree [5,1,8] is valid BST of size 3
    // Subtree [15,null,7] is NOT valid (7 < 15)
    // Full tree is NOT valid
    expect(largestBSTSubtree(root)).toBe(3);
  });

  it("should handle performance for large trees (performance test)", () => {
    // Build a left-skewed chain of depth ~5000 (within JS stack limits).
    // Each chain node has a right child (a single leaf) with a value that
    // makes the subtree NOT a valid BST.
    //
    // The top-down largestBSTSubtree at the root:
    //   1. Calls isValidBST on the entire tree — traverses all ~5000 nodes
    //   2. Returns false, then recurses into left child (the next chain node)
    //   3. At the next chain node, calls isValidBST again — traverses ~4999 nodes
    //   4. Repeats... Total: 5000 + 4999 + ... + 1 = O(n^2/2)
    //
    // The bottom-up approach visits each node exactly once: O(n).
    const chainLength = 5000;
    let root: TreeNode | null = null;
    let current: TreeNode | null = null;

    for (let i = 0; i < chainLength; i++) {
      const chainNode = new TreeNode(chainLength - i); // Decreasing values down the chain
      // Right child has a SMALLER value than parent, violating BST right-child rule
      chainNode.right = new TreeNode(0);

      if (!root) {
        root = chainNode;
        current = chainNode;
      } else {
        current!.left = chainNode;
        current = chainNode;
      }
    }

    const start = performance.now();
    const result = largestBSTSubtree(root);
    const elapsed = performance.now() - start;

    // Each leaf (right child) is a valid BST of size 1
    expect(result).toBeGreaterThanOrEqual(1);
    // O(n) bottom-up: ~10,000 node visits, should complete in <50ms
    // O(n^2) top-down: ~12.5M node visits, takes >100ms
    expect(elapsed).toBeLessThan(50);
  });
});
