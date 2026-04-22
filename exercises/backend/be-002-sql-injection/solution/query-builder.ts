export interface Query {
  text: string;
  params: unknown[];
}

export function findUserByName(name: string): Query {
  return {
    text: `SELECT * FROM users WHERE name = $1`,
    params: [name],
  };
}

export function findUsersByRole(role: string, limit: number): Query {
  return {
    text: `SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2`,
    params: [role, limit],
  };
}

export function searchUsers(
  namePattern: string,
  minAge: number,
  maxAge: number
): Query {
  return {
    text: `SELECT * FROM users WHERE name LIKE $1 AND age BETWEEN $2 AND $3`,
    params: [`%${namePattern}%`, minAge, maxAge],
  };
}

export function insertUser(
  name: string,
  email: string,
  role: string
): Query {
  return {
    text: `INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id`,
    params: [name, email, role],
  };
}

export function updateUserEmail(userId: string, newEmail: string): Query {
  return {
    text: `UPDATE users SET email = $1 WHERE id = $2`,
    params: [newEmail, userId],
  };
}
