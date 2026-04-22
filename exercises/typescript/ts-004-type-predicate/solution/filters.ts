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

// FIX: Return type is a type predicate — `animal is Cat`
export function isCat(animal: Animal): animal is Cat {
  return animal.kind === "cat";
}

export function isDog(animal: Animal): animal is Dog {
  return animal.kind === "dog";
}

export function isFish(animal: Animal): animal is Fish {
  return animal.kind === "fish";
}

// FIX: No cast needed — TypeScript infers Cat[] from the type predicate
export function getCats(animals: Animal[]): Cat[] {
  return animals.filter(isCat);
}

export function getDogs(animals: Animal[]): Dog[] {
  return animals.filter(isDog);
}

export function getFish(animals: Animal[]): Fish[] {
  return animals.filter(isFish);
}

// FIX: Type predicate narrows to NonNullable<T>
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// FIX: No cast needed
export function filterNullish(items: (string | null | undefined)[]): string[] {
  return items.filter(isNonNullable);
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

// FIX: Type predicate narrows Result to SuccessResult
export function isSuccess(result: Result): result is SuccessResult {
  return result.success === true;
}

// FIX: No cast needed — filter(isSuccess) produces SuccessResult[]
export function getSuccessData(results: Result[]): string[] {
  return results.filter(isSuccess).map((r) => r.data);
}
