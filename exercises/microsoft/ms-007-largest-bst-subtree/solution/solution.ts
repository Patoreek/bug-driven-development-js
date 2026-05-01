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

interface SubtreeInfo {
  min: number;
  max: number;
  size: number;
  isBST: boolean;
}

// OPTIMAL: Bottom-up post-order traversal — O(n) time
export function largestBSTSubtree(root: TreeNode | null): number {
  let maxSize = 0;

  function postorder(node: TreeNode | null): SubtreeInfo {
    if (!node) {
      return { min: Infinity, max: -Infinity, size: 0, isBST: true };
    }

    const left = postorder(node.left);
    const right = postorder(node.right);

    if (
      left.isBST &&
      right.isBST &&
      node.val > left.max &&
      node.val < right.min
    ) {
      const size = left.size + right.size + 1;
      maxSize = Math.max(maxSize, size);
      return {
        min: Math.min(node.val, left.min),
        max: Math.max(node.val, right.max),
        size,
        isBST: true,
      };
    }

    return { min: 0, max: 0, size: 0, isBST: false };
  }

  postorder(root);
  return maxSize;
}
