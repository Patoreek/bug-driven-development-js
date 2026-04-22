Methods like `push()`, `splice()`, and direct property assignment (`obj.prop = value`) all mutate the original object. Instead use:
- `[...array, newItem]` instead of `push`
- `array.filter()` instead of `splice`
- `{ ...obj, prop: newValue }` instead of `obj.prop = newValue`
