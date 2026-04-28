/**
 * A Range class that should be iterable using for...of loops.
 * Represents a numeric range from `start` to `end` (inclusive) with a given step.
 *
 * BUG: The iterator protocol is implemented incorrectly in several ways.
 */
export class Range {
  constructor(
    public readonly start: number,
    public readonly end: number,
    public readonly step: number = 1
  ) {
    if (step <= 0) {
      throw new Error("Step must be positive");
    }
  }

  // BUG 1: Uses a regular method name instead of Symbol.iterator.
  // for...of loops look for [Symbol.iterator](), not iterator().
  iterator() {
    let current = this.start;
    const end = this.end;
    const step = this.step;

    return {
      // BUG 2: The next() method doesn't return the correct shape.
      // It should return { value, done } but returns just the value
      // when not done, and doesn't signal completion properly.
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return value;
        }
        return undefined;
      },
    };
  }
}

/**
 * A linked list that should be iterable.
 *
 * BUG: The Symbol.iterator method exists but the iterator object
 * it returns does not conform to the iterator protocol.
 */
export interface LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
}

export class LinkedList<T> {
  head: LinkedListNode<T> | null = null;

  append(value: T): void {
    const node: LinkedListNode<T> = { value, next: null };
    if (!this.head) {
      this.head = node;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }

  // BUG 3: Returns an iterator-like object but doesn't properly
  // implement the iterator protocol -- missing { value, done } shape,
  // and the method is not keyed with Symbol.iterator.
  [Symbol.iterator]() {
    let current = this.head;

    return {
      next() {
        if (current) {
          const val = current.value;
          current = current.next;
          // BUG: Returns { val, done } instead of { value, done }
          return { val, done: false };
        }
        // BUG: Returns { done: true } without a value property
        return { done: true };
      },
    };
  }
}

/**
 * An infinite sequence generator that should be iterable.
 * Produces values by repeatedly applying a function: seed, fn(seed), fn(fn(seed)), ...
 *
 * BUG: The iterator works once but is not re-iterable because
 * Symbol.iterator returns `this` with stale state instead of
 * creating a fresh iterator each time.
 */
export class InfiniteSequence<T> {
  private current: T;

  constructor(
    private readonly seed: T,
    private readonly fn: (prev: T) => T
  ) {
    this.current = seed;
  }

  // BUG 4: Returns `this` as the iterator, which means the sequence
  // can only be iterated once. After the first iteration (or partial
  // iteration), `this.current` is already advanced and won't reset.
  [Symbol.iterator]() {
    return this;
  }

  next(): { value: T; done: false } {
    const value = this.current;
    this.current = this.fn(this.current);
    return { value, done: false };
  }
}
