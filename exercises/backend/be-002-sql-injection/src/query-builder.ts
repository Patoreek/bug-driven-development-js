// BUG: These query builder functions interpolate user input directly into SQL strings,
// making them vulnerable to SQL injection attacks.

export interface Query {
  text: string;
  params: unknown[];
}

export function findUserByName(name: string): Query {
  // BUG: User input is interpolated directly into the SQL string
  return {
    text: `SELECT * FROM users WHERE name = '${name}'`,
    params: [],
  };
}

export function findUsersByRole(role: string, limit: number): Query {
  // BUG: Both role and limit are interpolated directly
  return {
    text: `SELECT * FROM users WHERE role = '${role}' ORDER BY created_at DESC LIMIT ${limit}`,
    params: [],
  };
}

export function searchUsers(
  namePattern: string,
  minAge: number,
  maxAge: number
): Query {
  // BUG: All three parameters are interpolated directly
  return {
    text: `SELECT * FROM users WHERE name LIKE '%${namePattern}%' AND age BETWEEN ${minAge} AND ${maxAge}`,
    params: [],
  };
}

export function insertUser(
  name: string,
  email: string,
  role: string
): Query {
  // BUG: All values are interpolated directly
  return {
    text: `INSERT INTO users (name, email, role) VALUES ('${name}', '${email}', '${role}') RETURNING id`,
    params: [],
  };
}

export function updateUserEmail(userId: string, newEmail: string): Query {
  // BUG: Both userId and newEmail are interpolated directly
  return {
    text: `UPDATE users SET email = '${newEmail}' WHERE id = '${userId}'`,
    params: [],
  };
}
