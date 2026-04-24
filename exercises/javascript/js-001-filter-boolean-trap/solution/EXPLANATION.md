# Explanation: The Filter Boolean Trap

## Why the Bug Happens

JavaScript has **7 falsy values**: `false`, `0`, `-0`, `0n`, `""`, `null`, and `undefined` (plus `NaN`).

When you write `.filter(Boolean)`, it's equivalent to:

```ts
arr.filter((item) => Boolean(item));
```

This removes **all** falsy values, not just `null` and `undefined`. So:

- `0` (a valid score) is removed because `Boolean(0)` is `false`
- `""` (a valid display name) is removed because `Boolean("")` is `false`
- `false` (a valid feature flag) is removed because `Boolean(false)` is `false`

## The Fix

Instead of relying on Boolean coercion, explicitly check for only the values you want to remove:

### Before (buggy):
```ts
return scores.filter(Boolean) as number[];
```

### After (fixed):
```ts
return scores.filter(
  (score): score is number => score !== null && score !== undefined
);
```

The type predicate `score is number` tells TypeScript that the filtered array contains only `number` values, giving you proper type narrowing without a cast.

You can also use `score != null` (loose equality with `==`/`!=`) which checks for both `null` and `undefined` in one comparison:

```ts
return scores.filter((score): score is number => score != null);
```

## Common Variations

- **Filtering API responses**: JSON APIs often return `null` for missing fields. Using `.filter(Boolean)` on numeric data will silently drop zeroes.
- **Form validation**: Filtering out "empty" form fields with `Boolean` will remove fields where the user typed `0` or selected `false`.
- **Optional chaining results**: `[obj1?.value, obj2?.value].filter(Boolean)` drops zero values.

## Interview Context

This is a common JavaScript interview question testing knowledge of:
1. **Falsy values** — candidates should be able to list all falsy values
2. **Implicit type coercion** — understanding when and how JavaScript converts types
3. **`.filter()` callback semantics** — knowing that the callback's return value is coerced to boolean

A follow-up question might ask: "When IS `.filter(Boolean)` appropriate?" Answer: when you genuinely want to remove all falsy values, such as filtering out empty strings from a list of CSS class names.

## References

- [MDN: Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
- [MDN: Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
