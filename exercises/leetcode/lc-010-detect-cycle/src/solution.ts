/**
 * Linked List Cycle Detection
 *
 * Given the head of a linked list, determine if the linked list has a cycle.
 *
 * A cycle exists if some node in the list can be reached again by
 * continuously following the next pointer.
 *
 * Current approach: Store visited nodes in a Set — O(n) space.
 * Target: Floyd's tortoise and hare algorithm — O(1) space.
 */
export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function hasCycle(head: ListNode | null): boolean {
  // Brute force: O(n) space using a Set to track visited nodes
  const visited = new Set<ListNode>();

  let current = head;
  while (current !== null) {
    if (visited.has(current)) {
      return true;
    }
    visited.add(current);
    current = current.next;
  }

  return false;
}

/** Helper: Create a linked list from array with optional cycle */
export function createList(
  values: number[],
  cycleIndex?: number
): ListNode | null {
  if (values.length === 0) return null;

  const nodes: ListNode[] = values.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }

  if (cycleIndex !== undefined && cycleIndex >= 0 && cycleIndex < nodes.length) {
    nodes[nodes.length - 1].next = nodes[cycleIndex];
  }

  return nodes[0];
}
