export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Calculates the total price of all items in the cart.
 * Each item's contribution is price * quantity.
 */
export function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.price * item.quantity
  );
}

/**
 * Flattens an array of arrays into a single array.
 * e.g., [[1,2], [3,4], [5]] => [1,2,3,4,5]
 */
export function flattenArrays<T>(arrays: T[][]): T[] {
  return arrays.reduce((flat, arr) => flat.concat(arr));
}

/**
 * Groups items by a key extracted from each item.
 * e.g., groupBy([{type: "a", val: 1}, {type: "b", val: 2}, {type: "a", val: 3}], item => item.type)
 * => { a: [{type: "a", val: 1}, {type: "a", val: 3}], b: [{type: "b", val: 2}] }
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  });
}
