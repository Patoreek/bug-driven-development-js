export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(
    val = 0,
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
  const queue: TreeNode[] = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// BUGGY: Traverses the entire tree — O(n) time, O(n) space
// Collects all values into an array, then scans for the closest.
// Ignores the BST property that would allow an O(h) targeted search.
export function closestValue(root: TreeNode | null, target: number): number {
  const values: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (!node) return;
    values.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);

  let closest = values[0];
  for (const val of values) {
    if (Math.abs(val - target) < Math.abs(closest - target)) {
      closest = val;
    }
  }
  return closest;
}
