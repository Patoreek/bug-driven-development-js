/**
 * A Range class that is iterable using for...of loops.
 * Represents a numeric range from `start` to `end` (inclusive) with a given step.
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

  // FIX 1: Use Symbol.iterator as the method key so for...of can find it.
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    const step = this.step;

    return {
      // FIX 2: Return { value, done } objects conforming to the iterator protocol.
      next(): IteratorResult<number> {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

/**
 * A linked list that is iterable.
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

  // FIX 3: Return proper { value, done } objects from next().
  [Symbol.iterator]() {
    let current = this.head;

    return {
      next(): IteratorResult<T> {
        if (current) {
          const value = current.value;
          current = current.next;
          // FIX: Property must be named "value", not "val"
          return { value, done: false };
        }
        // FIX: Always include both value and done properties
        return { value: undefined, done: true };
      },
    };
  }
}

/**
 * An infinite sequence generator that is iterable.
 * Produces values by repeatedly applying a function: seed, fn(seed), fn(fn(seed)), ...
 *
 * FIX 4: Each call to [Symbol.iterator]() returns a NEW iterator
 * with fresh state, so the sequence can be re-iterated from the seed.
 */
export class InfiniteSequence<T> {
  constructor(
    private readonly seed: T,
    private readonly fn: (prev: T) => T
  ) {}

  // FIX: Return a new iterator object each time, starting from the seed.
  // This makes the sequence re-iterable.
  [Symbol.iterator]() {
    let current = this.seed;
    const fn = this.fn;

    return {
      next(): IteratorResult<T> {
        const value = current;
        current = fn(current);
        return { value, done: false };
      },
    };
  }
}
