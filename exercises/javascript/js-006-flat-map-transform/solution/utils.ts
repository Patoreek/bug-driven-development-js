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
  const allTags = posts.flatMap((post) => post.tags);
  return [...new Set(allTags)].sort();
}

/**
 * Expands orders into individual order lines.
 * Each order with N items becomes N order lines,
 * each containing the orderId and one item.
 */
export function expandOrders(orders: Order[]): OrderLine[] {
  return orders.flatMap((order) =>
    order.items.map((item) => ({
      orderId: order.orderId,
      item,
    }))
  );
}

/**
 * Given an array of sentences, returns all individual words (split by spaces).
 * Filters out any empty strings that might result from extra spaces.
 */
export function getAllWords(sentences: string[]): string[] {
  return sentences
    .flatMap((s) => s.split(" "))
    .filter((word) => word !== "");
}
