# Hint 1 (Mild)

Look at what each builder method returns. When you call `.host("localhost")`, what is the return type? Does the generic `State` type parameter change at all?

For a type-state builder, each method needs to return a builder whose type **includes** the new field. Think about how TypeScript intersection types (`&`) can be used to "add" a property to an existing type.

Also, check the `HasAllRequired` conditional type. Read it carefully: when `RequiredKeys extends keyof State`, what should the result be -- `true` or `false`?
