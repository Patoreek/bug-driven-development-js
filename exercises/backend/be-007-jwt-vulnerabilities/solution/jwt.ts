export interface JwtHeader {
  alg: string;
  typ: string;
}

export interface JwtPayload {
  sub: string;
  name: string;
  role: string;
  iss?: string;
  exp?: number;
  iat?: number;
}

export interface VerifyResult {
  valid: boolean;
  payload?: JwtPayload;
  error?: string;
}

const SECRET = "super-secret-key-123";
const EXPECTED_ISSUER = "auth.example.com";

export function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function base64urlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64").toString("utf-8");
}

function createSignature(headerB64: string, payloadB64: string): string {
  const { createHmac } = require("crypto");
  return createHmac("sha256", SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");
}

export function signJwt(payload: JwtPayload): string {
  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));
  const signature = createSignature(headerB64, payloadB64);
  return `${headerB64}.${payloadB64}.${signature}`;
}

const ALLOWED_ALGORITHMS = new Set(["HS256"]);

export function verifyJwt(token: string): VerifyResult {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }

    const [headerB64, payloadB64, signature] = parts;
    const header: JwtHeader = JSON.parse(base64urlDecode(headerB64));
    const payload: JwtPayload = JSON.parse(base64urlDecode(payloadB64));

    // Reject "none" and any unsupported algorithms
    if (!ALLOWED_ALGORITHMS.has(header.alg)) {
      return { valid: false, error: `Unsupported algorithm: ${header.alg}` };
    }

    // Verify signature
    const expectedSig = createSignature(headerB64, payloadB64);
    if (signature !== expectedSig) {
      return { valid: false, error: "Invalid signature" };
    }

    // Validate expiration
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: "Token expired" };
    }

    // Validate issuer
    if (!payload.iss || payload.iss !== EXPECTED_ISSUER) {
      return { valid: false, error: "Invalid issuer" };
    }

    return { valid: true, payload };
  } catch (e) {
    return { valid: false, error: "Token verification failed" };
  }
}
