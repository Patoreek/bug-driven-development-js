import { timingSafeEqual } from "crypto";

// API authentication module
// Validates bearer tokens for API access

interface AuthResult {
  valid: boolean;
  userId?: string;
  error?: string;
}

// In production, these would come from a database
const API_TOKENS: Record<string, string> = {
  "user-1": "tok_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "user-2": "tok_test_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "user-3": "tok_test_g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8",
};

// FIX: Constant-time string comparison using crypto.timingSafeEqual.
// Always compares ALL bytes regardless of where the mismatch is,
// preventing timing side-channel attacks.
export function safeCompare(a: string, b: string): boolean {
  // timingSafeEqual requires same length buffers.
  // If lengths differ, we still compare against a dummy to avoid
  // leaking length information through early return timing.
  if (a.length !== b.length) {
    // Compare `a` against itself to take constant time,
    // then return false. This prevents length-oracle attacks.
    const bufA = Buffer.from(a);
    timingSafeEqual(bufA, bufA);
    return false;
  }

  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return timingSafeEqual(bufA, bufB);
}

export function validateToken(providedToken: string): AuthResult {
  if (!providedToken || typeof providedToken !== "string") {
    return { valid: false, error: "Token is required" };
  }

  if (!providedToken.startsWith("tok_test_")) {
    return { valid: false, error: "Invalid token format" };
  }

  for (const [userId, storedToken] of Object.entries(API_TOKENS)) {
    // FIX: Use constant-time comparison
    if (safeCompare(providedToken, storedToken)) {
      return { valid: true, userId };
    }
  }

  return { valid: false, error: "Invalid token" };
}

// Middleware-style handler
export function authenticateRequest(headers: Record<string, string>): AuthResult {
  const authHeader = headers["authorization"] || headers["Authorization"];

  if (!authHeader) {
    return { valid: false, error: "Authorization header missing" };
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return { valid: false, error: "Invalid authorization format. Use: Bearer <token>" };
  }

  const token = parts[1];
  return validateToken(token);
}
