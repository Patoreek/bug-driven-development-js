# Hint 2 - The Missing Step

After reversing the entire array, you need to find each word (delimited by spaces or the end of the array) and reverse it individually.

Walk through the array tracking the `start` of the current word. When you hit a space or the end, reverse from `start` to the position before the space, then update `start` to the character after the space.

The `reverse` helper function is already available -- you just need to call it with the right indices for each word.
