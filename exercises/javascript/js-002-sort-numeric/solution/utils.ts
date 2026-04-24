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
  return [...products].sort((a, b) => a.price - b.price);
}

/**
 * Sorts a plain array of numbers from smallest to largest.
 */
export function sortNumbers(numbers: number[]): number[] {
  return [...numbers].sort((a, b) => a - b);
}

/**
 * Sorts calendar events by date, earliest first.
 */
export function sortByDate(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}
