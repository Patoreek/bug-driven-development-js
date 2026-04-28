/**
 * Merge Two Sorted Lists
 *
 * Merge two sorted linked lists and return it as a sorted list.
 * The list should be made by splicing together the nodes of the first two lists.
 *
 * Current approach: Convert both lists to arrays, merge arrays, convert back.
 * This works but uses O(n+m) extra space for the arrays.
 *
 * Target: O(1) extra space — merge in-place by re-linking nodes.
 */

export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

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

export function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

export function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null
): ListNode | null {
  // Brute force: convert to arrays, merge, convert back
  const arr1: number[] = [];
  const arr2: number[] = [];

  let current = list1;
  while (current) {
    arr1.push(current.val);
    current = current.next;
  }

  current = list2;
  while (current) {
    arr2.push(current.val);
    current = current.next;
  }

  // Merge two sorted arrays
  const merged: number[] = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      merged.push(arr1[i]);
      i++;
    } else {
      merged.push(arr2[j]);
      j++;
    }
  }
  while (i < arr1.length) {
    merged.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    merged.push(arr2[j]);
    j++;
  }

  // Convert back to linked list
  return arrayToList(merged);
}
