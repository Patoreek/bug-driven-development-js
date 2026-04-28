# Explanation: structuredClone Limitations

## Why the Bug Happens

JavaScript has three common approaches to deep copying, each with significant limitations:

### 1. `structuredClone` throws on functions

```typescript
// Before (buggy) -- throws DOMException because state contains functions
return structuredClone(state);

// After (fixed) -- separate functions, clone data, reattach
const { handlers, ...data } = state;
const clonedData = structuredClone(data);
return { ...clonedData, handlers };
```

The structured clone algorithm cannot serialize functions, Symbols, DOM nodes, or WeakMaps/WeakSets. When it encounters one, it throws immediately. The fix is to extract non-cloneable parts first, clone the rest, then reassemble.

### 2. `JSON.parse(JSON.stringify())` silently destroys types

```typescript
// Before (buggy) -- Map, Set, Date, RegExp are all lost
const cloned = JSON.parse(JSON.stringify(config));

// After (fixed) -- structuredClone preserves these types
const cloned = structuredClone(config);
```

JSON serialization is limited to strings, numbers, booleans, null, arrays, and plain objects. Everything else is silently transformed:
- `Map` and `Set` become `{}`
- `Date` becomes a string (and is NOT revived as a Date on parse)
- `RegExp` becomes `{}`
- `undefined` is dropped entirely
- `Infinity` and `NaN` become `null`

### 3. Spread operator is shallow

```typescript
// Before (buggy) -- only copies top-level properties
return { ...obj };

// After (fixed) -- true deep copy
return structuredClone(obj);
```

`{ ...obj }` copies property values. For primitive values this is fine, but for objects and arrays it copies the **reference**, not the content. Mutations to nested objects affect both the original and the "copy".

## Deep Cloning Comparison

| Feature | `{ ...obj }` | `JSON` round-trip | `structuredClone` |
|---------|-------------|-------------------|-------------------|
| Shallow copy | Yes | Yes | Yes |
| Deep copy | No | Yes | Yes |
| Functions | Copied (ref) | Lost | Throws |
| Date | Copied (ref) | Becomes string | Preserved |
| Map/Set | Copied (ref) | Becomes `{}` | Preserved |
| RegExp | Copied (ref) | Becomes `{}` | Preserved |
| undefined | Copied | Dropped | Preserved |
| Circular refs | No | Throws | Preserved |
| Performance | Fast | Slow | Medium |

## The Decision Tree

1. **Data-only, no functions?** Use `structuredClone` -- it handles Map, Set, Date, RegExp, circular references, and nested objects.
2. **Mixed data + functions?** Separate them: `structuredClone` the data, share function references.
3. **Need JSON serialization?** (e.g., for localStorage, network) Use `JSON.stringify` but be aware of what you lose. Consider a custom replacer/reviver for Date, Map, etc.
4. **Shallow copy is sufficient?** Use spread or `Object.assign`.

## Common Variations

1. **Class instances**: `structuredClone` does not preserve prototypes. A cloned class instance becomes a plain object. If you need prototype preservation, use a custom clone method.
2. **Circular references**: `structuredClone` handles them. JSON throws. Spread does not recurse, so the question does not arise.
3. **Transfer vs clone**: `structuredClone` supports a second argument for transferring ownership of ArrayBuffers (useful with Web Workers).

## Interview Context

Deep copying questions are extremely common in JavaScript interviews. Interviewers look for:
- Understanding the limitations of each approach (JSON, spread, structuredClone)
- Knowing that `structuredClone` is the modern standard for deep cloning
- Awareness that functions and DOM nodes are not cloneable
- Ability to compose cloning strategies for mixed-type data
- Understanding the difference between shallow and deep copies

## References

- [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN: Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
- [MDN: JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
