# Hint 3 -- Strong

Here are all the fixes:

**Range** -- rename method and fix return shape:
```typescript
// Before
iterator() { ... return value; ... return undefined; }

// After
[Symbol.iterator]() {
  // ...
  return {
    next() {
      if (current <= end) {
        const value = current;
        current += step;
        return { value, done: false };
      }
      return { value: undefined, done: true };
    }
  };
}
```

**LinkedList** -- fix property name:
```typescript
// Before
return { val, done: false };
return { done: true };

// After
return { value, done: false };
return { value: undefined, done: true };
```

**InfiniteSequence** -- create fresh iterator each time:
```typescript
// Before: returns `this`, so state is shared and never resets
[Symbol.iterator]() { return this; }

// After: returns a new closure with its own `current` variable
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
