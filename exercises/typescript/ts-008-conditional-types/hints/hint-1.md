# Hint 1 (Mild)

Look at how `ExtractStrings` checks the type: `[T] extends [string]`. What happens when `T` is `string | number`? Does the conditional check each member of the union individually, or does it check the union as a whole?

Compare this with TypeScript's built-in `Extract<T, U>` — how does it define its conditional type?
