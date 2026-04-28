// FIX: Corrected template literal type utilities

// FIX 1: Use Capitalize intrinsic type to uppercase the first letter.
// EventName<"click"> = `on${Capitalize<"click">}` = "onClick"
export type EventName<T extends string> = `on${Capitalize<T>}`;

// FIX 2: Convert the uppercase letter to lowercase in the kebab-case output.
// CSSProperty<"fontSize"> matches "f" (lowercase) then recurses.
// When it hits "S", it detects uppercase and emits `-${Lowercase<"S">}` = "-s".
export type CSSProperty<T extends string> = T extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? Head extends Lowercase<Head>
      ? `${Head}${CSSProperty<Tail>}`
      : `-${Lowercase<Head>}${CSSProperty<Tail>}`
    : `${Head}${CSSProperty<Tail>}`
  : T;

// FIX 3: Don't include the colon in the extracted parameter name.
// The infer pattern already captures the text after ":", so the result
// should be Param, not `:${Param}`.
export type PathParam<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | PathParam<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

// FIX 4: Use dot separator instead of slash, and include top-level keys.
// DotPath<{ user: { name: string } }> = "user" | "user.name"
// Include K itself (top-level) and recurse with dot prefix.
export type DotPath<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]:
        | (Prefix extends "" ? K : `${Prefix}.${K}`)
        | DotPath<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>;
    }[keyof T & string]
  : never;

// FIX 5: Build the tuple in correct order — Head first, then spread the rest.
// Split<"a.b.c", "."> = ["a", ...Split<"b.c", ".">] = ["a", "b", "c"]
export type Split<
  S extends string,
  D extends string,
> = S extends `${infer Head}${D}${infer Tail}`
  ? [Head, ...Split<Tail, D>]
  : [S];

// Runtime helpers (unchanged)

export function toEventName(event: string): string {
  return `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
}

export function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function extractPathParams(path: string): string[] {
  const matches = path.match(/:(\w+)/g);
  return matches ? matches.map((m) => m.slice(1)) : [];
}

export function splitString(str: string, delimiter: string): string[] {
  return str.split(delimiter);
}

// Type-level assertion helpers
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
