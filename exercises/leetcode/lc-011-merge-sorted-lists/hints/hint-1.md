# Hint 1 — Approach

You don't need to create any new nodes or arrays. Both lists are already sorted, and each `ListNode` has a `.next` pointer you can reassign.

Think about walking both lists at the same time. At each step, which node has the smaller value? That's the one you want next in your merged list.
