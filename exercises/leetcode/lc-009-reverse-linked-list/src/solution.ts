/**
 * Reverse Linked List
 *
 * Given the head of a singly linked list, reverse the list
 * and return the reversed list.
 *
 * Bug: This implementation creates a NEW list by copying values,
 * rather than reversing the existing nodes in place.
 * This uses O(n) extra space instead of O(1).
 *
 * Target: In-place reversal with O(1) extra space.
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
  // Bug: collects values and builds a new list (O(n) extra space)
  const values: number[] = [];
  let current = head;

  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }

  // Build a new reversed list
  let newHead: ListNode | null = null;
  for (const val of values) {
    const node = new ListNode(val);
    node.next = newHead;
    newHead = node;
  }

  return newHead;
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
