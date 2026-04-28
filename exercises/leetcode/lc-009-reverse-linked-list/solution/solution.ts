/**
 * Reverse Linked List — Optimal Solution
 *
 * Iterative in-place reversal with three pointers.
 * O(n) time, O(1) space.
 *
 * At each step, reverse the current node's next pointer to point
 * to the previous node, then advance all three pointers.
 */
export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current !== null) {
    const next = current.next; // Save next node
    current.next = prev; // Reverse the pointer
    prev = current; // Advance prev
    current = next; // Advance current
  }

  return prev; // prev is now the new head
}

/** Helper: Convert array to linked list */
export function arrayToList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}

/** Helper: Convert linked list to array */
export function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}
