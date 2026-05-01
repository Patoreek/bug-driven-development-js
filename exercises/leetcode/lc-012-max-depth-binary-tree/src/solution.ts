/**
 * Maximum Depth of Binary Tree
 *
 * Given the root of a binary tree, return its maximum depth.
 * A binary tree's maximum depth is the number of nodes along the longest
 * path from the root node down to the farthest leaf node.
 *
 * Current approach: BFS that counts total nodes processed per level
 * instead of counting levels. Contains an off-by-one error.
 *
 * Target: Clean DFS recursion.
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

  // BFS approach with a bug: counts nodes instead of levels
  const queue: TreeNode[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    // Bug: increments depth for each NODE instead of each LEVEL
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      depth++; // <-- should only increment once per level, not per node
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}
