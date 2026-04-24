# Hint 2 -- Medium

Three issues to fix:

1. **set trap**: Must `return true` after a successful set. Without it, strict mode throws a `TypeError`.

2. **get trap**: Should use `Reflect.get(target, prop, receiver)` instead of `target[String(prop)]`. The `Reflect` API is the companion to `Proxy` and handles edge cases properly.

3. **Validation gaps**: The schema supports `min`/`max` for numbers and `minLength`/`maxLength` for strings, but those checks are never performed.

4. **has trap**: Should also check the schema, not just the target.
