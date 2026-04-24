export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface BillingInfo {
  id: string;
  userId: string;
  plan: string;
  cardLast4: string;
  nextBillingDate: string;
}

export interface Order {
  id: string;
  userId: string;
  item: string;
  amount: number;
  date: string;
}

export interface FetchOptions {
  cache?: "force-cache" | "no-store" | "default";
  next?: { revalidate?: number; tags?: string[] };
  headers?: Record<string, string>;
}

type FetchCall = { url: string; options: FetchOptions };
const fetchCalls: FetchCall[] = [];

export function getFetchCalls(): FetchCall[] {
  return [...fetchCalls];
}

export function resetFetchCalls(): void {
  fetchCalls.length = 0;
}

const dataStore: Record<string, { profile: UserProfile; billing: BillingInfo; orders: Order[] }> = {
  "user-1": {
    profile: { id: "user-1", name: "Alice", email: "alice@example.com", role: "admin" },
    billing: { id: "bill-1", userId: "user-1", plan: "enterprise", cardLast4: "4242", nextBillingDate: "2026-05-01" },
    orders: [
      { id: "ord-1", userId: "user-1", item: "Widget Pro", amount: 99.99, date: "2026-04-15" },
    ],
  },
  "user-2": {
    profile: { id: "user-2", name: "Bob", email: "bob@example.com", role: "user" },
    billing: { id: "bill-2", userId: "user-2", plan: "basic", cardLast4: "1234", nextBillingDate: "2026-05-15" },
    orders: [
      { id: "ord-2", userId: "user-2", item: "Gadget Basic", amount: 29.99, date: "2026-04-10" },
    ],
  },
};

function simulateFetch(url: string, options: FetchOptions = {}): Record<string, unknown> | null {
  fetchCalls.push({ url, options });

  const userId = options.headers?.["x-user-id"];
  if (!userId || !dataStore[userId]) return null;

  const userData = dataStore[userId];

  if (url.includes("/profile")) return userData.profile as unknown as Record<string, unknown>;
  if (url.includes("/billing")) return userData.billing as unknown as Record<string, unknown>;
  if (url.includes("/orders")) return userData.orders as unknown as Record<string, unknown>;
  return null;
}

// FIX: Added cache: 'no-store' and per-user cache tags
export function fetchUserProfile(userId: string): UserProfile | null {
  const data = simulateFetch("/api/dashboard/profile", {
    cache: "no-store",
    next: { tags: [`profile-${userId}`] },
    headers: {
      "x-user-id": userId,
    },
  });
  return data as unknown as UserProfile | null;
}

// FIX: Added cache: 'no-store' and per-user cache tags
export function fetchBillingInfo(userId: string): BillingInfo | null {
  const data = simulateFetch("/api/dashboard/billing", {
    cache: "no-store",
    next: { tags: [`billing-${userId}`] },
    headers: {
      "x-user-id": userId,
    },
  });
  return data as unknown as BillingInfo | null;
}

// FIX: Added cache: 'no-store' and per-user cache tags
export function fetchUserOrders(userId: string): Order[] {
  const data = simulateFetch("/api/dashboard/orders", {
    cache: "no-store",
    next: { tags: [`orders-${userId}`] },
    headers: {
      "x-user-id": userId,
    },
  });
  return (data as unknown as Order[]) ?? [];
}
