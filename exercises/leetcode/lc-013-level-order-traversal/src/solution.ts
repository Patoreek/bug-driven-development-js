/**
 * Binary Tree Level Order Traversal
 *
 * Given the root of a binary tree, return the level order traversal
 * of its nodes' values (i.e., from left to right, level by level).
 *
 * Current approach: DFS that tracks depth but uses incorrect indexing,
 * causing nodes to be grouped incorrectly. It also doesn't properly
 * handle the case where a level's array doesn't exist yet.
 *
 * Target: BFS with queue, processing one level at a time.
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

export function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];

  // Buggy DFS approach — returns a flat array wrapped in another array
  // instead of properly separating nodes by level
  const result: number[][] = [];
  const flat: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (node === null) return;
    flat.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);

  // Bug: pushes everything as a single level
  result.push(flat);

  return result;
}
