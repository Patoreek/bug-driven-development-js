# Explanation: Proxy Validation Pitfalls

## Why the Bug Happens

There are three separate issues in this Proxy implementation:

### 1. Missing `return true` in set trap

The `set` trap **must** return `true` to indicate the assignment was successful. Without it, the trap implicitly returns `undefined` (falsy), which causes a `TypeError` in strict mode:

```
TypeError: 'set' on proxy: trap returned falsish for property 'name'
```

This is one of the most common Proxy mistakes because it works silently in non-strict mode but crashes in strict mode (and TypeScript/ES modules are always strict).

### 2. Direct property access instead of Reflect.get

The `get` trap accesses `target[String(prop)]` directly. This breaks in several ways:
- **Symbol properties** (like `Symbol.toPrimitive`) get stringified incorrectly
- **Inherited properties** from the prototype chain are skipped
- **Getters** don't receive the correct `this` context

### 3. Missing validation logic

The schema supports `min`, `max`, `minLength`, and `maxLength` constraints, but the validation code only checks `type` and `required`. Numeric ranges and string lengths are never validated.

### 4. Incomplete `has` trap

The `has` trap only checks if the property exists on the target object. It should also check the schema -- a property defined in the schema should report as "in" the object, even if no value has been set yet.

## The Fix

### Return true from set

```typescript
// Before (buggy)
target[key] = value;
// Missing return true!

// After (fixed)
Reflect.set(target, prop, value, receiver);
return true;
```

### Use Reflect.get

```typescript
// Before (buggy)
return target[String(prop)];

// After (fixed)
return Reflect.get(target, prop, receiver);
```

### Add min/max and minLength/maxLength validation

```typescript
// Add after type checking:
if (field.type === "number" && typeof value === "number") {
  if (field.min !== undefined && value < field.min) {
    throw new Error(`Property "${key}" must be at least ${field.min} (min)`);
  }
  if (field.max !== undefined && value > field.max) {
    throw new Error(`Property "${key}" must be at most ${field.max} (max)`);
  }
}

if (field.type === "string" && typeof value === "string") {
  if (field.minLength !== undefined && value.length < field.minLength) {
    throw new Error(`...minLength...`);
  }
  if (field.maxLength !== undefined && value.length > field.maxLength) {
    throw new Error(`...maxLength...`);
  }
}
```

### Fix the has trap

```typescript
// Before (buggy)
return String(prop) in target;

// After (fixed)
return String(prop) in schema || Reflect.has(target, prop);
```

## Why Use Reflect?

Every Proxy trap has a corresponding `Reflect` method. `Reflect` methods:
1. Have the same signatures as the trap functions
2. Perform the default behavior for that operation
3. Properly handle `receiver` (important for getters/setters and inheritance)
4. Return values that align with what traps need to return

Rule of thumb: **always use `Reflect` methods inside Proxy traps** unless you have a specific reason not to.

## Common Variations

1. **Forgetting `receiver` parameter**: Not passing `receiver` to `Reflect.get`/`Reflect.set` breaks getter/setter `this` binding
2. **Not handling Symbols**: Many internal operations use Symbol properties (e.g., `Symbol.toPrimitive`, `Symbol.iterator`)
3. **Infinite loops**: A `get` trap that accesses `target.prop` instead of `Reflect.get` can trigger itself recursively if the target is also a Proxy

## Interview Context

Proxy questions come up in senior/staff-level interviews. Interviewers look for:
- Understanding of the trap return value requirements
- Knowledge of `Reflect` as the companion to `Proxy`
- Awareness of strict mode differences
- Ability to implement practical patterns like validation, observable objects, or access control

## References

- [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN: Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [MDN: handler.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)
- [MDN: handler.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get)
