# Hint 2 (Medium)

TypeScript provides four **intrinsic string manipulation types**: `Capitalize<T>`, `Uncapitalize<T>`, `Uppercase<T>`, and `Lowercase<T>`. These work inside template literal types.

- `EventName` needs `Capitalize` to uppercase the first letter: `` `on${Capitalize<T>}` ``
- `CSSProperty` needs `Lowercase` to convert the uppercase letter when inserting the hyphen
- `PathParam` is including the `:` character in the result -- the `infer` already captures text after the colon, so don't re-add it
- `DotPath` uses `"/"` as separator but should use `"."`, and needs to emit each key as a standalone path (not just leaf paths)
- `Split` puts `Head` at the end of the tuple (`[...rest, Head]`) instead of the beginning (`[Head, ...rest]`)
