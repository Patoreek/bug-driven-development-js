// BUG: This module uses `any` to bypass type safety when parsing API responses.
// Runtime errors occur because data is blindly trusted after casting.

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
  };
}

// BUG: Uses `any` cast — no runtime validation, silently produces corrupt data
export function parseUserResponse(raw: unknown): ApiResponse<User> {
  const response = raw as any;

  return {
    data: {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
    },
    meta: {
      total: response.meta.total,
      page: response.meta.page,
    },
  };
}

// BUG: Uses `any` — crashes on missing fields, returns undefined without error
export function parseUserList(raw: unknown): User[] {
  const data = raw as any;
  return data.users.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));
}

// BUG: Uses `any` — no validation on the config shape at all
export function getConfigValue(config: unknown, key: string): string {
  const cfg = config as any;
  return cfg[key];
}
