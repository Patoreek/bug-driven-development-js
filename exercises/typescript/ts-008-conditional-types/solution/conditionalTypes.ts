// FIX: Corrected distributive/non-distributive patterns

// FIX: Use naked type parameter T (not [T]) to enable distribution over unions.
// ExtractStrings<string | number> distributes as:
//   (string extends string ? string : never) | (number extends string ? number : never)
//   = string | never = string
export type ExtractStrings<T> = T extends string ? T : never;

// FIX: Same fix — naked type parameter for distribution
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type ExtractFunctions<T> = T extends Function ? T : never;

// FIX: Naked type parameter distributes over each union member.
// NonNullableDeep<string | null | undefined> distributes as:
//   (string extends null | undefined ? never : string)
//   | (null extends null | undefined ? never : null)
//   | (undefined extends null | undefined ? never : undefined)
//   = string | never | never = string
export type NonNullableDeep<T> = T extends null | undefined ? never : T;

// FIX: Wrap in tuple to PREVENT distribution over `never`.
// `never` is the empty union. With a naked type parameter, the conditional
// distributes zero times, returning `never`. Wrapping in [T] / [never]
// prevents distribution and allows the check to work correctly.
export type IsNever<T> = [T] extends [never] ? true : false;

// FIX: Use naked type parameter for distribution over union members.
// TypeName<string | number> distributes as:
//   (string extends string ? "string" : ...) | (number extends number ? "number" : ...)
//   = "string" | "number"
export type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends undefined
        ? "undefined"
        : T extends null
          ? "null"
          : "object";

export function extractStrings<T>(values: T[]): Array<T extends string ? T : never> {
  return values.filter((v): v is any => typeof v === "string");
}

export function getTypeName(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  return typeof value;
}

export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
