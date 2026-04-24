# Explanation: Multi-Key Sort Order

## Why the Bug Happens

### Problem 1: Two separate sorts

The `sortEmployees` function calls `.sort()` twice:

```ts
sorted.sort((a, b) => b.salary - a.salary);
sorted.sort((a, b) => a.department.localeCompare(b.department));
```

The second sort completely overrides the first for elements with different departments. While JavaScript's sort is stable (ES2019+), meaning elements that compare as equal retain their relative order, relying on this for multi-key sorting is fragile, hard to read, and breaks if you get the order wrong. It also does two full passes over the array.

### Problem 2: Missing secondary sort key

The `sortTasks` function only compares priorities:

```ts
sorted.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
```

Tasks with the same priority keep their original order (due to stable sort), which is not necessarily chronological.

## The Fix

Combine all sort criteria into a **single comparator function**. Check the primary key first; if it's equal (returns 0), fall through to the secondary key.

### Before (buggy):
```ts
// Two separate sorts — fragile
sorted.sort((a, b) => b.salary - a.salary);
sorted.sort((a, b) => a.department.localeCompare(b.department));
```

### After (fixed):
```ts
return [...employees].sort((a, b) => {
  const deptCompare = a.department.localeCompare(b.department);
  if (deptCompare !== 0) return deptCompare;
  return b.salary - a.salary;
});
```

The pattern uses **short-circuit comparison**: if the primary key produces a non-zero result, return it immediately. Otherwise, fall through to the secondary key. This can also be written with the `||` operator:

```ts
return a.department.localeCompare(b.department) || b.salary - a.salary;
```

This works because `0 || x` returns `x`, and any non-zero `n || x` returns `n`.

## Common Variations

- **Three or more keys**: Just chain more `||` comparisons or `if` statements
- **Mixed ascending/descending**: Negate or swap `a`/`b` for individual keys
- **Sorting by enum/priority**: Map values to numbers first (like `PRIORITY_ORDER`)

## Interview Context

Multi-key sorting is a common interview topic because it tests:
1. Understanding of comparator functions and their return values
2. Ability to compose sorting criteria logically
3. Knowledge of the `||` short-circuit pattern for comparators
4. Awareness of sort stability in JavaScript (guaranteed since ES2019)

## References

- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN: String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)
