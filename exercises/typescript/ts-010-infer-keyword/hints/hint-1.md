# Hint 1 (Mild)

The `infer` keyword extracts a type from a specific **position** in a type structure. Look carefully at where `infer R` is placed in `GetReturnType` -- is it in the parameter list or after the `=>`?

For `FirstElement`, look at the destructuring pattern `[any, ...infer First]`. Which part of the tuple does `...infer First` capture -- the beginning or the end?

For `UnpackPromise` and `FlattenArray`, consider: what happens when the unwrapped type is itself a `Promise` or `Array`? Should the type keep unwrapping?
