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

// BUGGY: O(n^2) top-down approach — for each node, checks if its subtree
// is a valid BST (O(n) scan) then counts nodes (another O(n) scan).
// This is repeated for every node in the tree, giving O(n^2) overall.
export function largestBSTSubtree(root: TreeNode | null): number {
  if (!root) return 0;

  if (isValidBST(root, -Infinity, Infinity)) {
    return countNodes(root);
  }

  return Math.max(
    largestBSTSubtree(root.left),
    largestBSTSubtree(root.right)
  );
}

function isValidBST(
  node: TreeNode | null,
  min: number,
  max: number
): boolean {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;
  return (
    isValidBST(node.left, min, node.val) &&
    isValidBST(node.right, node.val, max)
  );
}

function countNodes(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}
