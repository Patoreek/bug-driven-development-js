// Database model -- represents a full database row
type UserRow = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "admin" | "editor" | "viewer";
  passwordHash: string;
  salary: number;
  internalNotes: string;
  sessionToken: string | null;
  createdAt: Date;
  lastLoginAt: Date;
};

// Simulated database
const users: UserRow[] = [
  {
    id: "u1",
    name: "Alice Chen",
    email: "alice@company.com",
    avatarUrl: "/avatars/alice.png",
    role: "admin",
    passwordHash: "$2b$10$abc123hashedpassword",
    salary: 150000,
    internalNotes: "Promoted in Q3. Flight risk - discuss retention.",
    sessionToken: "sess_abc123xyz",
    createdAt: new Date("2023-01-15"),
    lastLoginAt: new Date("2024-03-20"),
  },
  {
    id: "u2",
    name: "Bob Martinez",
    email: "bob@company.com",
    avatarUrl: "/avatars/bob.png",
    role: "editor",
    passwordHash: "$2b$10$def456hashedpassword",
    salary: 95000,
    internalNotes: "On PIP since February.",
    sessionToken: null,
    createdAt: new Date("2023-06-01"),
    lastLoginAt: new Date("2024-03-19"),
  },
  {
    id: "u3",
    name: "Carol Singh",
    email: "carol@company.com",
    avatarUrl: "/avatars/carol.png",
    role: "viewer",
    passwordHash: "$2b$10$ghi789hashedpassword",
    salary: 85000,
    internalNotes: "",
    sessionToken: "sess_def456abc",
    createdAt: new Date("2024-01-10"),
    lastLoginAt: new Date("2024-03-21"),
  },
];

// BUG: Returns entire database rows including sensitive fields
export function getUsers(): UserRow[] {
  return users;
}

export function getUserById(id: string): UserRow | undefined {
  return users.find((u) => u.id === id);
}

// The client only needs: id, name, avatarUrl, role
// But we're sending: passwordHash, salary, internalNotes, sessionToken, email, etc.
