/**
 * LRU Cache — Optimal Solution
 *
 * Hash Map + Doubly Linked List: O(1) for both get and put.
 *
 * The doubly linked list maintains access order (head = LRU, tail = MRU).
 * The hash map provides O(1) lookup from key to list node.
 *
 * Key operations:
 * - get: find node in map, move to tail (MRU), return value
 * - put: if exists, update and move to tail; if new and at capacity,
 *   evict head (LRU), then insert at tail
 */

class DLLNode {
  key: number;
  value: number;
  prev: DLLNode | null;
  next: DLLNode | null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache {
  private capacity: number;
  private cache: Map<number, DLLNode>;
  private head: DLLNode; // dummy head (LRU side)
  private tail: DLLNode; // dummy tail (MRU side)

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();

    // Dummy sentinel nodes to avoid null checks
    this.head = new DLLNode(0, 0);
    this.tail = new DLLNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    const node = this.cache.get(key);
    if (!node) return -1;

    // Move to tail (most recently used)
    this.removeNode(node);
    this.addToTail(node);

    return node.value;
  }

  put(key: number, value: number): void {
    const existingNode = this.cache.get(key);

    if (existingNode) {
      existingNode.value = value;
      this.removeNode(existingNode);
      this.addToTail(existingNode);
      return;
    }

    // Evict LRU if at capacity
    if (this.cache.size >= this.capacity) {
      const lru = this.head.next!;
      this.removeNode(lru);
      this.cache.delete(lru.key);
    }

    const newNode = new DLLNode(key, value);
    this.addToTail(newNode);
    this.cache.set(key, newNode);
  }

  private removeNode(node: DLLNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private addToTail(node: DLLNode): void {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev!.next = node;
    this.tail.prev = node;
  }
}
