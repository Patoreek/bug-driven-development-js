# Hint 1 (Mild)

The `FormValues` type currently maps every key to `string`. But a `number` field should produce a `number` value, and a `boolean` field should produce a `boolean` value.

You need a way to look at each field's `type` property and map it to the correct TypeScript type. Think about what TypeScript feature lets you do "if type is X, then Y, else if type is Z, then W..."
