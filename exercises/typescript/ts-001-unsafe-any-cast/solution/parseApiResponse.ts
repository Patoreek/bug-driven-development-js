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

const VALID_ROLES = new Set<string>(["admin", "editor", "viewer"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertUser(value: unknown): User {
  if (!isRecord(value)) {
    throw new Error("Expected user object");
  }

  if (typeof value.id !== "number") {
    throw new Error("Expected id to be a number");
  }

  if (typeof value.name !== "string" || value.name.length === 0) {
    throw new Error("Expected name to be a non-empty string");
  }

  if (typeof value.email !== "string" || value.email.length === 0) {
    throw new Error("Expected email to be a non-empty string");
  }

  if (typeof value.role !== "string" || !VALID_ROLES.has(value.role)) {
    throw new Error(`Expected role to be one of: admin, editor, viewer`);
  }

  return {
    id: value.id,
    name: value.name,
    email: value.email,
    role: value.role as User["role"],
  };
}

export function parseUserResponse(raw: unknown): ApiResponse<User> {
  if (!isRecord(raw)) {
    throw new Error("Expected response object");
  }

  if (!isRecord(raw.data)) {
    throw new Error("Expected response.data to be an object");
  }

  if (!isRecord(raw.meta)) {
    throw new Error("Expected response.meta to be an object");
  }

  const user = assertUser(raw.data);

  if (typeof raw.meta.total !== "number" || typeof raw.meta.page !== "number") {
    throw new Error("Expected meta.total and meta.page to be numbers");
  }

  return {
    data: user,
    meta: {
      total: raw.meta.total,
      page: raw.meta.page,
    },
  };
}

export function parseUserList(raw: unknown): User[] {
  if (!isRecord(raw)) {
    throw new Error("Expected object with users array");
  }

  if (!Array.isArray(raw.users)) {
    throw new Error("Expected users to be an array");
  }

  return raw.users.map((item: unknown) => assertUser(item));
}

export function getConfigValue(config: unknown, key: string): string {
  if (!isRecord(config)) {
    throw new Error("Expected config object");
  }

  if (!(key in config)) {
    throw new Error(`Key "${key}" not found in config`);
  }

  const value = config[key];

  if (typeof value !== "string") {
    throw new Error(`Expected config["${key}"] to be a string, got ${typeof value}`);
  }

  return value;
}
