/**
 * Groups an array of items by a key function.
 * The key function receives each item and returns the group key.
 *
 * Example:
 *   groupBy([{name: 'Alice', age: 30}, {name: 'Bob', age: 30}], item => item.age)
 *   => { 30: [{name: 'Alice', age: 30}, {name: 'Bob', age: 30}] }
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    // FIX: Initialize array if it doesn't exist, then push
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Groups an array of objects by a specific property name.
 *
 * Example:
 *   groupByProperty([{status: 'active'}, {status: 'active'}], 'status')
 *   => { active: [{status: 'active'}, {status: 'active'}] }
 */
export function groupByProperty<T extends Record<string, unknown>>(
  items: T[],
  property: keyof T & string
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = String(item[property]);
    // FIX: Initialize array if it doesn't exist, then push
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Counts items in each group.
 *
 * Example:
 *   countBy(['a', 'b', 'a', 'c', 'b', 'a'], x => x)
 *   => { a: 3, b: 2, c: 1 }
 */
export function countBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, number> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    // FIX: Increment existing count or start at 1
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
