export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  department: string;
  phone: string;
  address: string;
  joinedAt: string;
  lastLogin: string;
  preferences: Record<string, string>;
};

export type UserListItem = Pick<User, "id" | "name" | "avatar">;
export type UserCardItem = Pick<User, "id" | "name" | "role" | "department">;
export type UserPublicProfile = Omit<User, "preferences" | "phone" | "address">;

// Simulated full user database
const users: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@company.com",
    avatar: "/avatars/alice.png",
    bio: "Senior frontend engineer with 10 years of experience.",
    role: "engineer",
    department: "Engineering",
    phone: "+1-555-0101",
    address: "123 Main St, San Francisco, CA",
    joinedAt: "2020-01-15",
    lastLogin: "2025-04-20",
    preferences: { theme: "dark", lang: "en", notifications: "email" },
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@company.com",
    avatar: "/avatars/bob.png",
    bio: "Product manager focused on developer tools.",
    role: "pm",
    department: "Product",
    phone: "+1-555-0102",
    address: "456 Oak Ave, New York, NY",
    joinedAt: "2021-06-01",
    lastLogin: "2025-04-19",
    preferences: { theme: "light", lang: "en", notifications: "slack" },
  },
];

// Full fetch (internal use)
export function getUsers(): User[] {
  return users.map((u) => ({ ...u }));
}

// FIX: Return only the fields needed for a list view
export function getUsersForList(): UserListItem[] {
  return users.map(({ id, name, avatar }) => ({ id, name, avatar }));
}

// FIX: Return only the fields needed for a card view
export function getUsersForCard(): UserCardItem[] {
  return users.map(({ id, name, role, department }) => ({ id, name, role, department }));
}

// FIX: Return public profile without sensitive/private fields
export function getUserProfile(id: string): UserPublicProfile | undefined {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  const { preferences, phone, address, ...publicProfile } = user;
  return publicProfile;
}
