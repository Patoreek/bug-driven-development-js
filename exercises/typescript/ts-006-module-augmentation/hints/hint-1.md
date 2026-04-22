# Hint 1 (Mild)

The problem is that `ExtendedRequest` and `ExtendedResponse` are completely separate interfaces from `Request` and `Response`. Using `Request & ExtendedRequest` creates a new type that isn't assignable to `Request`, which breaks the `Middleware` type signature.

Think about how you could add the extra properties without creating separate interfaces. TypeScript has a feature that lets you "re-open" an existing interface and add new properties to it.
