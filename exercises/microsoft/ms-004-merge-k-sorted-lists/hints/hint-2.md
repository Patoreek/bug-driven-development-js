# Hint 2: Technique

Use **divide and conquer**. Instead of merging lists[0] with lists[1], then the result with lists[2], etc., pair up the lists:

- Merge lists[0] with lists[1]
- Merge lists[2] with lists[3]
- Merge lists[4] with lists[5]
- ... and so on

Then take those merged results and pair them up again. Repeat until one list remains.

This is exactly like the merge step in merge sort, but applied to k lists instead of array halves. Each round processes all N nodes exactly once, and there are log(k) rounds.
