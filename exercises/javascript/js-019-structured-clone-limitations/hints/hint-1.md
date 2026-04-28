# Hint 1 -- Mild

Think about what types each cloning method can handle:
- `structuredClone` handles `Map`, `Set`, `Date`, `RegExp`, nested objects, and arrays -- but what happens when it encounters a function?
- `JSON.parse(JSON.stringify())` handles strings, numbers, booleans, plain objects, and arrays -- but what happens to `Map`, `Set`, `Date`, and `RegExp`?
- The spread operator `{ ...obj }` copies properties -- but how deep does it go?

Match the right cloning tool to each situation based on what the data contains.
