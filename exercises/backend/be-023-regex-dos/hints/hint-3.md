# Hint 3 -- Strong

Here are the fixed regex patterns:

```typescript
// Email: remove the outer group + quantifier
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// URL: simplify to non-nested pattern
const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

// JSON-safe: single character class, no alternation
const safeRegex = /^[a-zA-Z0-9 _-]*$/;

// Slug: enforce structure without nesting
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
```

Each fix removes either a nested quantifier or overlapping alternation. The resulting patterns match the same valid inputs but run in linear time instead of exponential time on non-matching inputs.
