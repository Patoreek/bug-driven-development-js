// BUG: Template literal type utilities with incorrect patterns

// BUG 1: EventName tries to create event handler names like "onClick", "onHover",
// but fails to capitalize the first letter of the event name.
// EventName<"click" | "hover"> should produce "onClick" | "onHover",
// but instead produces "onclick" | "onhover" (lowercase).
export type EventName<T extends string> = `on${T}`;

// BUG 2: CSSProperty tries to convert camelCase to kebab-case,
// but the recursive type doesn't handle the base case properly.
// CSSProperty<"fontSize"> should produce "font-size",
// but the implementation only handles single uppercase letters
// and doesn't convert them to lowercase in the output.
export type CSSProperty<T extends string> = T extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? Head extends Lowercase<Head>
      ? `${Head}${CSSProperty<Tail>}`
      : `-${Head}${CSSProperty<Tail>}`
    : `${Head}${CSSProperty<Tail>}`
  : T;

// BUG 3: PathParam tries to extract route parameters from a path template.
// PathParam<"/users/:id/posts/:postId"> should produce "id" | "postId",
// but the pattern matching is wrong — it matches the colon as part of the param name.
export type PathParam<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? `:${Param}` | PathParam<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? `:${Param}`
      : never;

// BUG 4: Dot-path accessor type for nested objects.
// DotPath<{ user: { name: string; age: number } }> should produce
// "user" | "user.name" | "user.age", but the recursive template literal
// construction uses the wrong separator and doesn't include the top-level keys.
export type DotPath<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: DotPath<T[K], `${Prefix}/${K}`>;
    }[keyof T & string]
  : Prefix;

// BUG 5: Split type splits a string by a delimiter.
// Split<"a.b.c", "."> should produce ["a", "b", "c"],
// but the recursion builds the tuple in reverse order.
export type Split<
  S extends string,
  D extends string,
> = S extends `${infer Head}${D}${infer Tail}`
  ? [...Split<Tail, D>, Head]
  : [S];

// Runtime helpers for testing

export function toEventName(event: string): string {
  return `on${event}`;
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
