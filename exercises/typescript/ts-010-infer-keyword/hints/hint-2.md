# Hint 2 (Medium)

The `infer` keyword acts like a type-level variable that captures whatever type appears at its position:

```typescript
// infer in return position -> extracts return type
T extends (...args: any[]) => infer R ? R : never

// infer in parameter position -> extracts parameter types
T extends (...args: infer P) => any ? P : never
```

For `FirstElement`, the pattern should be `[infer First, ...any[]]` -- put `infer` on the element you want to capture.

For `UnpackPromise` and `FlattenArray`, make the type **recursive**: after extracting the inner type, check if it still matches the pattern and extract again.

For `ExtractEventData`, you need `infer D` where the `Data` type parameter is: `Event<string, infer D>`.
