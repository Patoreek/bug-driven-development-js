# Explanation: Closure Over Loop Variable

## Why the Bug Happens

This is one of JavaScript's most famous gotchas, rooted in the difference between `var` and `let`:

- **`var`** is **function-scoped**. There is only ONE `i` variable shared across all loop iterations.
- **`let`** is **block-scoped**. Each loop iteration creates a NEW `i` variable.

When you create a closure (a function that references an outer variable) inside a loop using `var`, all closures share the **same** variable. By the time any closure executes, the loop has finished and the variable holds its **final** value.

```typescript
// With var: ONE shared variable
for (var i = 0; i < 3; i++) {
  callbacks.push(() => i); // All three closures reference THE SAME i
}
// After loop: i === 3
// callbacks[0]() => 3, callbacks[1]() => 3, callbacks[2]() => 3
```

## The Fix

Simply change `var` to `let`:

```typescript
// Before (buggy)
for (var i = 0; i < n; i++) {
  callbacks.push(() => i);
}

// After (fixed)
for (let i = 0; i < n; i++) {
  callbacks.push(() => i);
}
```

With `let`, each iteration of the loop creates a fresh binding of `i`. Each closure captures its own copy.

## Alternative Fixes

### IIFE (Immediately Invoked Function Expression)
The pre-ES6 solution was to create a new scope with an IIFE:

```typescript
for (var i = 0; i < n; i++) {
  (function(capturedI) {
    callbacks.push(() => capturedI);
  })(i);
}
```

### forEach or map
Using array methods naturally creates a new scope per iteration:

```typescript
Array.from({ length: n }, (_, i) => () => i);
```

## Common Variations

1. **setTimeout in a loop**: The classic interview version uses `setTimeout(() => console.log(i), 1000)` inside a `var` loop
2. **Event listeners in a loop**: Adding click handlers to DOM elements inside a `var` loop
3. **Async operations in a loop**: Starting async operations that reference the loop counter

## Interview Context

This is arguably the single most common JavaScript interview question. Interviewers expect you to:
1. Identify that `var` is function-scoped and `let` is block-scoped
2. Explain why closures capture the *variable*, not the *value*
3. Know multiple solutions (let, IIFE, forEach)
4. Understand this as a historical artifact that `let` was designed to fix

## References

- [MDN: Closures -- Creating closures in loops: A common mistake](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#creating_closures_in_loops_a_common_mistake)
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: var](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var)
