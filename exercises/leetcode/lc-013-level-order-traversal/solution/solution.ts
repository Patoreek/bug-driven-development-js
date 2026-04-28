/**
 * Binary Tree Level Order Traversal — Optimal Solution
 *
 * BFS with queue, processing one level at a time.
 * O(n) time, O(n) space.
 *
 * Key insight: at the start of each iteration, the queue contains
 * exactly all nodes at the current level. Record the queue size,
 * process that many nodes, and their children form the next level.
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

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}
