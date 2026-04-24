# Solution: RSC Serialization

## The Bug

When React Server Components pass props to Client Components, the data goes through a JSON-like serialization protocol. Several JavaScript types are **not JSON-serializable**:

| Type | `JSON.stringify` result | Data lost? |
|------|------------------------|------------|
| `Date` | `"2026-04-22T09:00:00.000Z"` (string) | Type info lost |
| `Map` | `"{}"` | All entries lost |
| `Set` | `"{}"` | All values lost |
| `Function` | `undefined` (omitted) | Entirely dropped |
| `RegExp` | `"{}"` | Pattern lost |

The buggy code passed these types directly as props, relying on the default JSON serialization behavior, which destroyed the data.

## The Fix

### Wrap non-serializable types with type markers

```typescript
// Before (Date passed directly — becomes string)
date: event.date,

// After (wrapped with type marker)
date: {
  __type: "__date__",
  value: event.date.toISOString(),
},
```

### Each type gets its own serialization strategy

```typescript
// Set -> array of values
attendees: { __type: "__set__", values: Array.from(event.attendees) }

// Map -> array of entries
metadata: { __type: "__map__", entries: Array.from(event.metadata.entries()) }

// Function -> name/identifier (can't serialize the function itself)
formatter: { __type: "__function__", name: event.formatter.name || "anonymous" }

// RegExp -> source and flags
pattern: { __type: "__regexp__", source: event.pattern.source, flags: event.pattern.flags }
```

### Client-side reconstruction

```typescript
// Reconstruct Date
date: new Date(dateField.value),

// Use array directly (Set members)
attendees: attendeesField.values,

// Reconstruct record from Map entries
metadata: Object.fromEntries(metadataField.entries),
```

## Key Takeaway

The server-client boundary in RSC is a **serialization boundary**. Anything that crosses it must be JSON-serializable. This is a fundamental constraint of the RSC architecture — not a bug, but a design decision that developers must work around.

Best practices:
1. **Transform data on the server** before passing to client components
2. **Keep non-serializable data on the server** — use Server Components for rendering that needs Dates, Maps, etc.
3. **Use a consistent type-marker pattern** for data that must cross the boundary

## Related Documentation

- [Serializable Types in RSC](https://react.dev/reference/rsc/use-client#serializable-types)
- [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [Server Components](https://react.dev/reference/rsc/server-components)

## Interview Context

This is a critical RSC knowledge area. Interviewers test:
- Awareness of what types can cross the server-client boundary
- Knowledge of `JSON.stringify` behavior for different types
- Ability to design serialization strategies for complex data
- Understanding that functions can NEVER cross the boundary
- Common variations: passing Date to a client date picker, passing Map as a lookup table
