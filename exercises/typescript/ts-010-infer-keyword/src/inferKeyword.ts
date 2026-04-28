// BUG: Type inference utilities with incorrect infer patterns

// BUG 1: GetReturnType tries to extract the return type of a function,
// but the infer position is wrong — it infers the parameter types instead.
// GetReturnType<(x: string) => number> should be `number`, but returns `[string]`.
export type GetReturnType<T> = T extends (...args: infer R) => any ? R : never;

// BUG 2: UnpackPromise tries to deeply unwrap Promise types,
// but it doesn't recurse, so Promise<Promise<string>> returns Promise<string>
// instead of string.
export type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

// BUG 3: FirstElement tries to get the first element of a tuple,
// but the infer pattern captures the rest instead of the first element.
// FirstElement<[string, number, boolean]> should be `string`, but returns `[number, boolean]`.
export type FirstElement<T extends readonly unknown[]> =
  T extends [any, ...infer First] ? First : never;

// BUG 4: ConstructorParams tries to extract constructor parameter types,
// but it infers the instance type instead of the parameter types.
// ConstructorParams<typeof Date> should be constructor params, not Date.
export type ConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer P ? P : never;

// BUG 5: FlattenArray tries to flatten a nested array type.
// FlattenArray<number[][]> should be `number`, but the implementation
// only unwraps one level and uses Array<T> instead of (infer U)[].
export type FlattenArray<T> = T extends Array<infer U> ? U : T;

// BUG 6: ExtractEventData tries to extract the data type from a custom event type,
// but the infer pattern doesn't match the structure correctly.
// For Event<"click", { x: number }>, it should return { x: number }.
export type Event<Name extends string, Data> = {
  type: Name;
  data: Data;
  timestamp: number;
};

export type ExtractEventData<T> = T extends Event<string, unknown> ? T : never;

// Runtime helpers

export function getReturnValue<T>(fn: () => T): T {
  return fn();
}

export async function unwrapPromise<T>(p: Promise<T>): Promise<T> {
  return p;
}

export function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Type-level assertion helpers
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? true
  : false;
