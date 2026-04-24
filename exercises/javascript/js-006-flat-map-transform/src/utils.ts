export interface Post {
  id: number;
  title: string;
  tags: string[];
}

export interface Order {
  orderId: string;
  items: string[];
}

export interface OrderLine {
  orderId: string;
  item: string;
}

/**
 * Extracts all unique tags from an array of posts.
 * Returns a flat array of unique tag strings, sorted alphabetically.
 */
export function getUniqueTags(posts: Post[]): string[] {
  // Bug: .map() returns nested arrays, not flat
  const allTags = posts.map((post) => post.tags);
  return [...new Set(allTags)].sort();
}

/**
 * Expands orders into individual order lines.
 * Each order with N items becomes N order lines,
 * each containing the orderId and one item.
 *
 * e.g., { orderId: "A", items: ["x", "y"] }
 *   => [{ orderId: "A", item: "x" }, { orderId: "A", item: "y" }]
 */
export function expandOrders(orders: Order[]): OrderLine[] {
  // Bug: .map() wraps each order's lines in a sub-array
  return orders.map((order) =>
    order.items.map((item) => ({
      orderId: order.orderId,
      item,
    }))
  ) as unknown as OrderLine[];
}

/**
 * Given an array of sentences, returns all individual words (split by spaces).
 * Filters out any empty strings that might result from extra spaces.
 */
export function getAllWords(sentences: string[]): string[] {
  // Bug: .map() with .split() creates nested arrays
  return sentences.map((s) => s.split(" ")) as unknown as string[];
}
