# Hint 2 — Data Structure

The trick to clean linked list merges is a **dummy head node**. Create a single dummy `ListNode` as the start of your merged list, and keep a `tail` pointer that tracks where to append next.

This avoids messy special-case logic for "which node becomes the head of the result."
