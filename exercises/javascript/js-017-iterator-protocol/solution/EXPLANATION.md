# Explanation: Iterator Protocol

## Why the Bug Happens

JavaScript's iteration system is built on two related protocols:

1. **Iterable protocol**: An object is iterable if it has a `[Symbol.iterator]()` method that returns an iterator.
2. **Iterator protocol**: An iterator is an object with a `next()` method that returns `{ value, done }` objects.

`for...of`, the spread operator (`...`), destructuring, and `Array.from()` all rely on these protocols. If either protocol is violated, the object simply does not work with any iteration syntax.

### Bug 1: Wrong method name on Range

```typescript
// Before (buggy) -- regular string method, invisible to for...of
iterator() { ... }

// After (fixed) -- Symbol.iterator is what for...of looks for
[Symbol.iterator]() { ... }
```

`for...of` calls `obj[Symbol.iterator]()`, not `obj.iterator()`. Using a string name creates a normal method that is never called by the language's iteration machinery.

### Bug 2: Wrong return shape on Range and LinkedList

```typescript
// Before (buggy) -- returns raw value, not { value, done }
return value;
return undefined;

// Before (buggy) -- property named "val" instead of "value"
return { val, done: false };
return { done: true };

// After (fixed) -- correct shape
return { value, done: false };
return { value: undefined, done: true };
```

The iterator protocol requires `next()` to return `{ value: T, done: boolean }`. Returning a raw value or using the wrong property name means the consuming code receives `undefined` for every iteration step.

### Bug 3: Non-resettable InfiniteSequence

```typescript
// Before (buggy) -- returns `this`, sharing mutable state
[Symbol.iterator]() { return this; }

// After (fixed) -- returns a new iterator with fresh state
[Symbol.iterator]() {
  let current = this.seed;
  const fn = this.fn;
  return {
    next() {
      const value = current;
      current = fn(current);
      return { value, done: false };
    }
  };
}
```

When `[Symbol.iterator]()` returns `this`, the iterator and the iterable are the same object. This means iteration state (the `current` value) is shared. After partial iteration, the state is already advanced, so the next `for...of` loop picks up where the last one left off instead of starting from the beginning.

## The Iterable vs Iterator Distinction

An **iterable** is a factory: each call to `[Symbol.iterator]()` should produce a **new iterator** so the collection can be iterated multiple times. Built-in collections like `Array`, `Map`, and `Set` all follow this pattern.

A **generator function** naturally gets this right because each call creates a new generator object. But hand-rolled iterators need to be careful to create fresh closure state.

## Common Variations

1. **Generator shortcut**: Using `*[Symbol.iterator]() { yield* this.items; }` is often simpler than hand-rolling a `next()` method
2. **Async iteration**: The same protocol exists for async: `[Symbol.asyncIterator]()` returning `{ async next() }` for use with `for await...of`
3. **Forgetting `done: true`**: An iterator that never returns `done: true` causes `for...of` and `[...spread]` to loop forever

## Interview Context

Iterator protocol questions are common in mid-to-senior JavaScript interviews. Interviewers look for:
- Understanding the two-protocol system (iterable vs iterator)
- Knowing that `Symbol.iterator` is the key, not a string method name
- Understanding why `next()` must return `{ value, done }` objects
- Awareness that returning `this` from `[Symbol.iterator]()` makes an object single-use
- Ability to implement custom iterables for data structures

## References

- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)
- [MDN: for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
- [MDN: Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)
