# Hint 3

For numeric sorting, provide a comparison function:
```ts
numbers.sort((a, b) => a - b)
```

For sorting objects by a date string property, compare the strings directly:
```ts
events.sort((a, b) => a.date.localeCompare(b.date))
```

ISO date strings (`YYYY-MM-DD`) sort correctly as strings because the most significant part (year) comes first.
