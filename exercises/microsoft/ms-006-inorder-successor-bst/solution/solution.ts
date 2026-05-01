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

// SOLUTION: BST property search — O(h) time, O(1) space
// The inorder successor is the smallest value greater than p.val.
// Walk from the root: when p.val < node.val, this node could be the successor
// (record it), then go left to find something smaller. When p.val >= node.val,
// the successor must be to the right.
export function inorderSuccessor(
  root: TreeNode | null,
  p: TreeNode
): TreeNode | null {
  let successor: TreeNode | null = null;
  let node = root;

  while (node) {
    if (p.val < node.val) {
      successor = node;
      node = node.left;
    } else {
      node = node.right;
    }
  }

  return successor;
}
