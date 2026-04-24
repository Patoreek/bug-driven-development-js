# Hint 3

Here's the pattern for multi-key sorting:

```ts
employees.sort((a, b) => {
  const primary = a.department.localeCompare(b.department);
  if (primary !== 0) return primary;
  return b.salary - a.salary; // descending
});
```

Or more concisely with `||`:

```ts
employees.sort((a, b) =>
  a.department.localeCompare(b.department) || b.salary - a.salary
);
```

Apply the same pattern to `sortTasks`: compare priority first, then `createdAt` strings.
