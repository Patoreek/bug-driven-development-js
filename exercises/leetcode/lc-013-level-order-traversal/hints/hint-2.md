# Hint 2 — Data Structure

Use a **queue** (array with `push` and `shift`). The key insight is:

At the start of each outer loop iteration, the queue contains **exactly all nodes at the current level**. If you record `queue.length` before processing, you know how many nodes to dequeue for this level.

After dequeuing those nodes, the queue will contain exactly the next level's nodes.
