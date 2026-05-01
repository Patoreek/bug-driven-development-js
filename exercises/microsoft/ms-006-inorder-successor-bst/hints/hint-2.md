# Hint 2: Technique

Walk from the root and maintain a `successor` variable:

- When `p.val < node.val`: this node is a candidate! Record it as the potential successor, then go **left** to see if there's something even smaller (but still greater than p)
- When `p.val >= node.val`: this node is too small or equal, go **right** to find something bigger

When you reach null, your recorded `successor` is the answer (or null if you never turned left).

This is similar to how binary search finds "the first element greater than X" in a sorted array.
