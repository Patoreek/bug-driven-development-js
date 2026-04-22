// BUG: This module tries to extend a third-party library's types using
// module augmentation, but the augmentation is done incorrectly.
// The types don't merge, so the custom properties aren't recognized.

// Simulated "express" library types (pretend this is from node_modules)
export interface Request {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface Response {
  status(code: number): Response;
  json(data: unknown): void;
  send(body: string): void;
}

// Simulated middleware types
export type Middleware = (req: Request, res: Response, next: () => void) => void;

// ---- User's code below ----

// BUG: Tries to add `user` and `requestId` to Request by creating a new
// interface instead of augmenting the existing one.
interface ExtendedRequest {
  user?: {
    id: string;
    name: string;
    role: "admin" | "user";
  };
  requestId?: string;
}

interface ExtendedResponse {
  locals?: Record<string, unknown>;
}

// BUG: Because the types don't merge, authMiddleware stores the user data
// in req.headers["x-user"] as a JSON string instead of on req.user directly.
// This is a common workaround when types don't support custom properties.
export function authMiddleware(
  req: Request & ExtendedRequest,
  _res: Response,
  next: () => void
): void {
  // BUG: Stores user as a header instead of a proper property because
  // the developer couldn't figure out the type augmentation.
  const user = { id: "user-1", name: "Alice", role: "admin" };
  req.headers["x-user"] = JSON.stringify(user);
  (req as any).user = user;
  next();
}

export function requestIdMiddleware(
  req: Request & ExtendedRequest,
  _res: Response,
  next: () => void
): void {
  const requestId = `req-${Date.now()}`;
  req.headers["x-request-id"] = requestId;
  (req as any).requestId = requestId;
  next();
}

export function protectedHandler(
  req: Request & ExtendedRequest,
  res: Response & ExtendedResponse
): void {
  // BUG: Reads user from headers instead of req.user because the type
  // doesn't have user on it. Parsing JSON from headers is fragile.
  const userHeader = req.headers["x-user"];
  if (!userHeader) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = JSON.parse(userHeader);
    res.json({
      message: `Hello ${user.name}`,
      requestId: req.headers["x-request-id"],
    });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// BUG: getUserRole has to parse JSON from headers because Request doesn't have .user
export function getUserRole(req: Request): string {
  const userHeader = req.headers["x-user"];
  if (!userHeader) return "anonymous";
  try {
    return JSON.parse(userHeader).role ?? "anonymous";
  } catch {
    return "anonymous";
  }
}

export function createPipeline(middlewares: Middleware[], handler: Middleware): Middleware {
  return (req, res, next) => {
    let index = 0;

    function runNext(): void {
      if (index < middlewares.length) {
        middlewares[index++](req, res, runNext);
      } else {
        handler(req, res, next);
      }
    }

    runNext();
  };
}
