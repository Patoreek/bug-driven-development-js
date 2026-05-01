# Hint 1: Property

You're searching a **binary search tree**, but the current code ignores what makes it a BST. In a BST, for any node:

- All values in the left subtree are **less than** the node's value
- All values in the right subtree are **greater than** the node's value

This means if your target is less than the current node, you know the closest value can't be in the right subtree (it would only be further away). You don't need to visit every node.
