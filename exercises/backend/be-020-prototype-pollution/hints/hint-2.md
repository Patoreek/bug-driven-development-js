# Hint 2 (Medium)

Three keys are dangerous and must be rejected during deep merge:
- `"__proto__"` — directly modifies the prototype
- `"constructor"` — gives access to the constructor function
- `"prototype"` — modifies the constructor's prototype

Create a blocklist and skip any key that matches. The simplest approach is a `Set` containing these three strings, checked before processing each key.
