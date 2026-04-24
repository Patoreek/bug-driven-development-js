/**
 * Returns the top N scores from the array, highest first.
 * The original array should NOT be modified.
 */
export function getTopScores(scores: number[], n: number): number[] {
  const sorted = scores.sort((a, b) => b - a);
  return sorted.slice(0, n);
}

/**
 * Returns a sorted copy of the items array (by name, A-Z).
 * The original array should NOT be modified.
 */
export function getSortedByName<T extends { name: string }>(items: T[]): T[] {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns the median value from a numeric array.
 * The original array should NOT be modified.
 */
export function getMedian(numbers: number[]): number {
  const sorted = numbers.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

/**
 * Returns items sorted by price (lowest first) and the original unsorted items.
 * Used to show both "featured" (original order) and "by price" views.
 */
export function getProductViews(products: { name: string; price: number }[]): {
  featured: { name: string; price: number }[];
  byPrice: { name: string; price: number }[];
} {
  const byPrice = products.sort((a, b) => a.price - b.price);
  return {
    featured: products, // Should be original order
    byPrice,
  };
}
