// Solution: Proper generic constraints using `extends`

interface HasId {
  id: string;
}

export class Repository<T extends HasId> {
  private items: T[] = [];

  add(item: T): T {
    this.items.push(item);
    return item;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }
}

export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

export function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b } as T & U;
}

export function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
