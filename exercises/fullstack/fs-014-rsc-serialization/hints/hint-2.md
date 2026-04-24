# Hint 2 (Medium)

Use a wrapper object with a `__type` marker for each non-serializable type:

- **Date:** `{ __type: "__date__", value: date.toISOString() }`
- **Set:** `{ __type: "__set__", values: Array.from(set) }`
- **Map:** `{ __type: "__map__", entries: Array.from(map.entries()) }`
- **Function:** `{ __type: "__function__", name: fn.name || "anonymous" }`
- **RegExp:** `{ __type: "__regexp__", source: regex.source, flags: regex.flags }`

Then in `reconstructOnClient`, check for the `__type` field and reconstruct accordingly.
