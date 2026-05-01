# Hint 2: Technique

Use **iterative binary search** down the tree. At each node:

1. Check if this node is closer to the target than your current best -- if so, update your closest value
2. If `target < node.val`, go left (the answer might be this node or something smaller)
3. If `target >= node.val`, go right (we need something larger)

This is O(h) time where h is the height, and O(1) space since you only track a single `closest` variable. No array needed.
