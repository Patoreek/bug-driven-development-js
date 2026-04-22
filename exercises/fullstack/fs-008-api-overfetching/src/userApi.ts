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

// BUG: Always returns the full user object regardless of what the caller needs
export function getUsers(): User[] {
  return users.map((u) => ({ ...u }));
}

// BUG: User list endpoint returns every field even when only name + avatar needed
export function getUsersForList(): User[] {
  return getUsers();
}

// BUG: User card endpoint returns every field even when only name + role + department needed
export function getUsersForCard(): User[] {
  return getUsers();
}

// BUG: User profile endpoint returns preferences even for public profile view
export function getUserProfile(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}
