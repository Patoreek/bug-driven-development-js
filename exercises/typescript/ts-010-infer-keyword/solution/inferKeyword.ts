// FIX: Corrected infer patterns

// FIX 1: Infer R in the return position, not the parameter position.
// GetReturnType<(x: string) => number> = number
export type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// FIX 2: Recurse to deeply unwrap nested Promises.
// UnpackPromise<Promise<Promise<string>>> = UnpackPromise<Promise<string>> = UnpackPromise<string> = string
export type UnpackPromise<T> = T extends Promise<infer U> ? UnpackPromise<U> : T;

// FIX 3: Infer the first element, not the rest.
// Place infer First before the rest spread.
// FirstElement<[string, number, boolean]> = string
export type FirstElement<T extends readonly unknown[]> =
  T extends [infer First, ...any[]] ? First : never;

// FIX 4: Infer P from the parameter position, not the return/instance position.
// ConstructorParams<typeof Date> = ConstructorParameters<typeof Date>
export type ConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

// FIX 5: Recurse to deeply flatten nested array types.
// FlattenArray<number[][]> = FlattenArray<number[]> = FlattenArray<number> = number
export type FlattenArray<T> = T extends Array<infer U> ? FlattenArray<U> : T;

// FIX 6: Use infer to extract the Data type parameter from the Event structure.
// ExtractEventData<Event<"click", { x: number }>> = { x: number }
export type Event<Name extends string, Data> = {
  type: Name;
  data: Data;
  timestamp: number;
};

export type ExtractEventData<T> = T extends Event<string, infer D> ? D : never;

// Runtime helpers (unchanged)

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
