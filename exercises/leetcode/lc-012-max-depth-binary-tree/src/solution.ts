/**
 * Maximum Depth of Binary Tree — Optimal Solution
 *
 * Clean DFS recursion: O(n) time, O(h) space (stack depth).
 *
 * Base case: null node has depth 0.
 * Recursive case: 1 + max(depth of left subtree, depth of right subtree).
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

export function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
