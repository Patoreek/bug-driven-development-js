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

// Finds a node by value in the tree
export function findNode(
  root: TreeNode | null,
  val: number
): TreeNode | null {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) ?? findNode(root.right, val);
}

// BUGGY: Full inorder traversal — O(n) time, O(n) space
// Builds a sorted array of all nodes, then linearly searches for the target
// to find its successor. Ignores the BST property entirely.
export function inorderSuccessor(
  root: TreeNode | null,
  p: TreeNode
): TreeNode | null {
  const sorted: TreeNode[] = [];

  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    sorted.push(node);
    inorder(node.right);
  }

  inorder(root);

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].val === p.val && i + 1 < sorted.length) {
      return sorted[i + 1];
    }
  }
  return null;
}
