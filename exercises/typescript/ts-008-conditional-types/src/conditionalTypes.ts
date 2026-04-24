// BUG: Conditional type utility library with incorrect distributive/non-distributive patterns

// BUG 1: ExtractStrings wraps T in a tuple, preventing distribution over unions.
// ExtractStrings<string | number> should return `string`, but returns `never`
// because [string | number] does not extend [string].
export type ExtractStrings<T> = [T] extends [string] ? T : never;

// BUG 2: ExtractFunctions has the same wrapping issue.
// ExtractFunctions<string | (() => void) | number> should return `(() => void)`,
// but the tuple wrapping prevents distribution.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type ExtractFunctions<T> = [T] extends [Function] ? T : never;

// BUG 3: NonNullableDeep wraps T in a tuple, preventing distribution.
// NonNullableDeep<string | null | undefined> should return `string`,
// but [string | null | undefined] extends [null | undefined] is false,
// so it returns the full union unchanged.
export type NonNullableDeep<T> = [T] extends [null | undefined] ? never : T;

// BUG 4: IsNever uses a naked type parameter, which distributes over `never`.
// Since `never` is the empty union, the conditional type distributes zero times,
// returning `never` instead of `true`.
// IsNever<never> should return `true`, but returns `never`.
export type IsNever<T> = T extends never ? true : false;

// BUG 5: TypeName wraps T in a tuple, preventing distribution.
// TypeName<string | number> should return "string" | "number",
// but because the tuple prevents distribution, it falls through to "other".
export type TypeName<T> = [T] extends [string]
  ? "string"
  : [T] extends [number]
    ? "number"
    : [T] extends [boolean]
      ? "boolean"
      : [T] extends [undefined]
        ? "undefined"
        : [T] extends [null]
          ? "null"
          : "object";

// Helper functions that test the type behaviors at runtime
export function extractStrings<T>(values: T[]): Array<T extends string ? T : never> {
  return values.filter((v): v is any => typeof v === "string");
}

export function getTypeName(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  return typeof value;
}

// Type-level assertion helpers (used in tests)
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
