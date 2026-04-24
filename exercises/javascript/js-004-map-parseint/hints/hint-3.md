# Hint 3

Wrap `parseInt` in an arrow function so only the string is passed, and always specify base 10:

```ts
strings.map((s) => parseInt(s, 10))
```

Or use `Number` for simple numeric strings (but not for strings like `"16px"`):

```ts
strings.map(Number)  // ["1","2","3"] => [1, 2, 3]
```
