/**
 * Linked List Cycle Detection — Optimal Solution
 *
 * Floyd's Tortoise and Hare algorithm: O(n) time, O(1) space.
 *
 * Two pointers move at different speeds:
 * - Slow (tortoise): 1 step at a time
 * - Fast (hare): 2 steps at a time
 *
 * If there's a cycle, the fast pointer will eventually catch up to
 * the slow pointer (they'll meet inside the cycle).
 * If there's no cycle, the fast pointer reaches the end (null).
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
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
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
