# Hint 1: Observation

The inorder successor is the **smallest value greater than p.val**. Think about what that means in a BST:

- If you're at a node whose value is greater than p.val, it's a *candidate* for the successor
- If you're at a node whose value is less than or equal to p.val, the successor must be somewhere to the right

You don't need to build a sorted array of all nodes. The BST structure already tells you which direction to search.
