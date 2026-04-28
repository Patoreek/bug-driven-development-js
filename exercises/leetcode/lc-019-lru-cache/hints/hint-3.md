# Hint 3 — Implementation

```
class DLLNode:
  key, value, prev, next

class LRUCache:
  map: Map<key → DLLNode>
  head ←→ tail  (dummy sentinels, head.next = tail initially)

  removeNode(node):
    node.prev.next = node.next
    node.next.prev = node.prev

  addToTail(node):
    node.prev = tail.prev
    node.next = tail
    tail.prev.next = node
    tail.prev = node

  get(key):
    if not in map: return -1
    node = map.get(key)
    removeNode(node)
    addToTail(node)   // refresh as most recently used
    return node.value

  put(key, value):
    if key in map: update value, removeNode, addToTail, return
    if at capacity: lru = head.next, removeNode(lru), map.delete(lru.key)
    create new node, addToTail, map.set(key, node)
```

The node stores the `key` so that during eviction you can delete it from the map.
