/**
 * Validate Binary Search Tree
 *
 * Given the root of a binary tree, determine if it is a valid BST.
 *
 * A valid BST is defined as:
 * - The left subtree of a node contains only nodes with keys LESS THAN the node's key.
 * - The right subtree of a node contains only nodes with keys GREATER THAN the node's key.
 * - Both left and right subtrees must also be binary search trees.
 *
 * Current approach: Only checks immediate children — misses cases where a
 * deeper node violates the BST property relative to an ancestor.
 *
 * Target: Pass min/max bounds recursively.
 */

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(
    val: number = 0,
    left: TreeNode | null = null,
    right: TreeNode | null = null
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export function arrayToTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;

  const root = new TreeNode(arr[0]);
  const queue: (TreeNode | null)[] = [root];
  let i = 1;

  while (i < arr.length) {
    const current = queue.shift();
    if (current === null || current === undefined) {
      continue;
    }

    if (i < arr.length) {
      if (arr[i] !== null) {
        current.left = new TreeNode(arr[i] as number);
        queue.push(current.left);
      }
      i++;
    }

    if (i < arr.length) {
      if (arr[i] !== null) {
        current.right = new TreeNode(arr[i] as number);
        queue.push(current.right);
      }
      i++;
    }
  }

  return root;
}

export function isValidBST(root: TreeNode | null): boolean {
  if (root === null) return true;

  // Bug: Only checks immediate children, not the full BST invariant
  // For example, this passes for:
  //       5
  //      / \
  //     1   6
  //        / \
  //       3   7     <-- 3 < 5, violates BST (should be > 5)
  // But this code only checks 3 < 6 (immediate parent), not 3 > 5 (ancestor)

  if (root.left !== null && root.left.val >= root.val) {
    return false;
  }

  if (root.right !== null && root.right.val <= root.val) {
    return false;
  }

  return isValidBST(root.left) && isValidBST(root.right);
}
