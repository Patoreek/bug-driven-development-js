// BUG: This module provides filtering utilities but the type guard functions
// return `boolean` instead of type predicates. This means TypeScript can't
// narrow the types after filtering, forcing callers to cast with `as`.

export interface Cat {
  kind: "cat";
  name: string;
  indoor: boolean;
}

export interface Dog {
  kind: "dog";
  name: string;
  breed: string;
}

export interface Fish {
  kind: "fish";
  name: string;
  freshwater: boolean;
}

export type Animal = Cat | Dog | Fish;

// BUG: Returns `boolean` — TypeScript doesn't know the filtered array contains only Cats
export function isCat(animal: Animal): boolean {
  return animal.kind === "cat";
}

// BUG: Same problem
export function isDog(animal: Animal): boolean {
  return animal.kind === "dog";
}

// BUG: Same problem
export function isFish(animal: Animal): boolean {
  return animal.kind === "fish";
}

// BUG: Returns `Animal[]` instead of `Cat[]` because isCat returns boolean, not a type predicate
export function getCats(animals: Animal[]): Cat[] {
  return animals.filter(isCat) as Cat[];
}

// BUG: Same — needs a cast that would be unnecessary with proper type predicate
export function getDogs(animals: Animal[]): Dog[] {
  return animals.filter(isDog) as Dog[];
}

export function getFish(animals: Animal[]): Fish[] {
  return animals.filter(isFish) as Fish[];
}

// BUG: Uses truthiness check instead of proper null/undefined check.
// This filters out empty strings ("") and zero (0) along with null/undefined.
export function isNonNullable(value: unknown): boolean {
  return !!value;
}

// BUG: filterNullish also drops empty strings because of the broken isNonNullable
export function filterNullish(items: (string | null | undefined)[]): string[] {
  return items.filter(isNonNullable) as string[];
}

export interface SuccessResult {
  success: true;
  data: string;
}

export interface ErrorResult {
  success: false;
  error: string;
}

export type Result = SuccessResult | ErrorResult;

// BUG: Returns boolean, so after checking isSuccess(result), TypeScript still
// sees `result` as `Result`, not narrowed to `SuccessResult`
export function isSuccess(result: Result): boolean {
  return result.success === true;
}

export function getSuccessData(results: Result[]): string[] {
  return results.filter(isSuccess).map((r) => (r as SuccessResult).data);
}
