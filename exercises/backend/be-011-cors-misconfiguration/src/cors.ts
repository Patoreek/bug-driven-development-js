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
 * Should validate origin, handle preflight, and set appropriate headers.
 */
export function getCorsHeaders(request: CorsRequest): CorsResult {
  const headers: CorsHeaders = {};

  // BUG: Wildcard origin with credentials is rejected by browsers
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Credentials"] = "true";

  // BUG: Missing Access-Control-Allow-Methods header
  // BUG: Missing Access-Control-Allow-Headers header

  // BUG: Doesn't detect or handle preflight (OPTIONS) requests
  return {
    headers,
    isPreflight: false,
  };
}
