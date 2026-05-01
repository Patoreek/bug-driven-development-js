# Hint 1: Direction

The current approach checks every node from the top down, re-traversing subtrees multiple times. Think about the opposite direction: what if you processed children **before** their parents?

In tree algorithms, when you need information about subtrees to make decisions at the parent, there's a specific traversal order that naturally provides this.
