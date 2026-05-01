# Hint 2: Technique

Use **post-order traversal** (left, right, then current node). Each recursive call should return a summary of the subtree:

- The **minimum** value in the subtree
- The **maximum** value in the subtree
- The **size** (number of nodes)
- Whether the subtree **is a valid BST**

A node forms a valid BST if both its children are valid BSTs AND the node's value is greater than the left subtree's max and less than the right subtree's min.

For null nodes, use `min: Infinity` and `max: -Infinity` as sentinels so the BST check naturally passes for leaves.
