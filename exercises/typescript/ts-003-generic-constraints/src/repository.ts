// BUG: This module implements a generic repository pattern but the generic
// type parameters lack proper constraints. This allows invalid entities
// (without `id`) to be used, and operations fail at runtime.

// BUG: No constraint on T — any type can be passed, even ones without an `id` field
export class Repository<T> {
  private items: T[] = [];

  add(item: T): T {
    this.items.push(item);
    return item;
  }

  // BUG: Accessing `id` on T without knowing T has an `id` property
  findById(id: string): T | undefined {
    return this.items.find((item: any) => item.id === id);
  }

  // BUG: Same issue — assumes T has an `id`
  remove(id: string): boolean {
    const index = this.items.findIndex((item: any) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  // BUG: Same issue
  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.items.findIndex((item: any) => item.id === id);
    if (index === -1) return undefined;
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }
}

// BUG: No constraint means K could be a key that doesn't exist on T.
// Because there's no constraint, the function wraps the result in a
// toString() call for "safety" — but this breaks number values.
export function pluck<T, K>(items: T[], key: K): unknown[] {
  return items.map((item: any) => {
    const val = item[key];
    // BUG: Converts everything to string because return type is unknown[]
    // and the developer "played it safe" by normalizing values.
    return typeof val === "string" ? val : String(val);
  });
}

// BUG: merge should require both arguments to be objects, and return the correct merged type
export function merge<T, U>(a: T, b: U): T & U {
  return { ...(a as any), ...(b as any) };
}

// BUG: getProperty should constrain key to be an actual key of obj
export function getProperty<T, K>(obj: T, key: K): unknown {
  return (obj as any)[key];
}
