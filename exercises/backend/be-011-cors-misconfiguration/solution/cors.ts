export interface CorsRequest {
  method: string;
  headers: Record<string, string>;
}

export interface CorsHeaders {
  [key: string]: string;
}

export interface CorsResult {
  headers: CorsHeaders;
  isPreflight: boolean;
}

const ALLOWED_ORIGINS = [
  "https://app.example.com",
  "https://admin.example.com",
];

const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-Request-ID"];

/**
 * Generates CORS headers for a given request.
 * Validates origin, handles preflight, and sets appropriate headers.
 */
export function getCorsHeaders(request: CorsRequest): CorsResult {
  const headers: CorsHeaders = {};
  const origin = request.headers.origin;
  const isPreflight = request.method === "OPTIONS";

  // Validate origin against allowlist
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return { headers, isPreflight };
  }

  // Set the specific allowed origin (not wildcard)
  headers["Access-Control-Allow-Origin"] = origin;
  headers["Access-Control-Allow-Credentials"] = "true";

  // Add preflight-specific headers only for OPTIONS requests
  if (isPreflight) {
    headers["Access-Control-Allow-Methods"] = ALLOWED_METHODS.join(", ");
    headers["Access-Control-Allow-Headers"] = ALLOWED_HEADERS.join(", ");
    headers["Access-Control-Max-Age"] = "86400";
  }

  return { headers, isPreflight };
}
