# Hint 2

When a `.map()` callback returns an array, the result is **nested** (array of arrays). You need to flatten it. JavaScript has two options:
- `.map(...).flat()` — map then flatten in two steps
- `.flatMap(...)` — map and flatten in one step

Also, `new Set()` uses reference equality for arrays, so it won't deduplicate `["js"]` and `["js"]` — they're different array objects.
