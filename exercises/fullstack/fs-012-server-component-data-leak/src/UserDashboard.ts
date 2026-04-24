// BUG: Server component that fetches user-specific data but doesn't prevent
// cross-user cache contamination. Uses default fetch caching which means
// all users see the first user's data.

import { fetchUserProfile, fetchBillingInfo, fetchUserOrders } from "./api";
import type { UserProfile, BillingInfo, Order } from "./api";

export interface DashboardData {
  profile: UserProfile | null;
  billing: BillingInfo | null;
  orders: Order[];
  error?: string;
}

// BUG: This function doesn't use cookies() or headers() from 'next/headers',
// so Next.js may statically render and cache this component.
// It also doesn't pass any user-specific cache options to the fetch functions.
export function getUserDashboardData(userId: string): DashboardData {
  // BUG: No dynamic rendering opt-out (no cookies()/headers() call)
  // BUG: Relies entirely on the buggy fetch functions that cache globally

  const profile = fetchUserProfile(userId);
  const billing = fetchBillingInfo(userId);
  const orders = fetchUserOrders(userId);

  if (!profile) {
    return { profile: null, billing: null, orders: [], error: "User not found" };
  }

  return { profile, billing, orders };
}

// BUG: Cache key computation doesn't include user ID
// This is what causes the cross-user data leak
export function getDashboardCacheKey(_userId: string): string {
  // BUG: Cache key is static — same for all users!
  return "dashboard-data";
}
