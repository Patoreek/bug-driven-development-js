# Explanation — LRU Cache

## Why the Array Approach is O(n)

The buggy solution uses an array to track access order:

```typescript
// get: O(n) — indexOf scans the array, splice shifts elements
const idx = this.order.indexOf(key);
this.order.splice(idx, 1);
this.order.push(key);

// put eviction: O(n) — shift moves all elements
const lruKey = this.order.shift()!;
```

With n items in the cache, every `get` and `put` involves O(n) array operations. For 200k calls with capacity 3000, that's 200k * 3000 = 600M operations.

## The Optimal Solution: Hash Map + Doubly Linked List

```
Hash Map: key → DLLNode (O(1) lookup)
Doubly Linked List: head ←→ [node1] ←→ [node2] ←→ ... ←→ tail
                    (LRU)                                   (MRU)
```

### Key Insight

The hash map gives O(1) access to any node. The doubly linked list gives O(1) removal and insertion because each node has `prev` and `next` pointers.

### Operations

```typescript
// removeNode: O(1) — just reassign 2 pointers
node.prev.next = node.next;
node.next.prev = node.prev;

// addToTail: O(1) — insert before dummy tail
node.prev = this.tail.prev;
node.next = this.tail;
this.tail.prev.next = node;
this.tail.prev = node;
```

## Visual Walkthrough

```
cache = new LRUCache(2)

put(1, 1):  head ←→ [1:1] ←→ tail     map: {1→node1}
put(2, 2):  head ←→ [1:1] ←→ [2:2] ←→ tail   map: {1→n1, 2→n2}
get(1):     head ←→ [2:2] ←→ [1:1] ←→ tail   (moved 1 to tail)
put(3, 3):  evict LRU (key 2, head.next)
            head ←→ [1:1] ←→ [3:3] ←→ tail   map: {1→n1, 3→n3}
get(2):     returns -1 (not in map)
```

## Why the Node Stores the Key

When evicting, you need to delete the key from the hash map. But you only have the node reference (from `head.next`). The node must store its key so you can call `this.cache.delete(lru.key)`.

## Sentinel Nodes

Dummy head and tail nodes eliminate null checks:
- Without sentinels: "Is the list empty? Is this the head? Is this the tail?" — many edge cases
- With sentinels: `removeNode` and `addToTail` always work the same way, no special cases

## Complexity Comparison

| Operation | Array approach | Doubly linked list |
|-----------|---------------|-------------------|
| get | O(n) | **O(1)** |
| put (update) | O(n) | **O(1)** |
| put (evict) | O(n) | **O(1)** |

## JavaScript Alternative

JavaScript's `Map` preserves insertion order and supports `map.keys().next()` to get the oldest key. You can implement LRU with just a `Map`:

```typescript
get(key) {
  if (!this.map.has(key)) return -1;
  const val = this.map.get(key)!;
  this.map.delete(key);  // remove and re-insert to refresh order
  this.map.set(key, val);
  return val;
}
```

This works in practice but `delete` + `set` on a Map isn't guaranteed O(1) in all engines. The doubly linked list solution is the standard interview answer.

## Common Variations

- **LFU Cache** — evict least frequently used, with LRU as tiebreaker (LeetCode 460)
- **TTL Cache** — evict entries that have expired
- **Design an in-memory file system** — similar hash map + tree structure (LeetCode 588)

## Interview Follow-ups

- "Can you make this thread-safe?" — Add a mutex/lock around each operation
- "What if capacity is very large?" — Consider distributed caching (consistent hashing)
- "How would you implement this in a language without ordered maps?" — Doubly linked list + hash map is the universal approach
