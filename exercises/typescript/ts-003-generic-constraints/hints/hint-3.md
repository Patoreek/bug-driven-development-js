# Hint 3 (Strong)

Define a base interface and use it as a constraint:

```ts
interface HasId {
  id: string;
}

export class Repository<T extends HasId> {
  // Now you can safely access item.id without `as any`
  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}
```

For the utility functions:

```ts
export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

export function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b } as T & U;
}
```
