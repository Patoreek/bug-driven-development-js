export interface Product {
  name: string;
  price: number;
}

export interface CalendarEvent {
  title: string;
  date: string; // ISO date string like "2024-01-15"
}

/**
 * Sorts products by price from lowest to highest.
 */
export function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    // Convert to strings for comparison
    return String(a.price) > String(b.price) ? 1 : -1;
  });
}

/**
 * Sorts a plain array of numbers from smallest to largest.
 */
export function sortNumbers(numbers: number[]): number[] {
  return [...numbers].sort();
}

/**
 * Sorts calendar events by date, earliest first.
 */
export function sortByDate(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort();
}
