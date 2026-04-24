import { fetchUserProfile, fetchBillingInfo, fetchUserOrders } from "./api";
import type { UserProfile, BillingInfo, Order } from "./api";

export interface DashboardData {
  profile: UserProfile | null;
  billing: BillingInfo | null;
  orders: Order[];
  error?: string;
}

// FIX: In a real Next.js app, you'd call cookies() or headers() here
// to opt out of static rendering. The fetch calls now use cache: 'no-store'.
export function getUserDashboardData(userId: string): DashboardData {
  const profile = fetchUserProfile(userId);
  const billing = fetchBillingInfo(userId);
  const orders = fetchUserOrders(userId);

  if (!profile) {
    return { profile: null, billing: null, orders: [], error: "User not found" };
  }

  return { profile, billing, orders };
}

// FIX: Cache key now includes the user ID for per-user isolation
export function getDashboardCacheKey(userId: string): string {
  return `dashboard-data-${userId}`;
}
