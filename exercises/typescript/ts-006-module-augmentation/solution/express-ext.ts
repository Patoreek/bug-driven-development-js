// Simulated "express" library types
export interface Request {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  // FIX: Declare augmented properties directly on the interface
  // In a real project you'd use `declare module 'express'` to augment,
  // but since we own this interface, we add them here.
  user?: {
    id: string;
    name: string;
    role: "admin" | "user";
  };
  requestId?: string;
}

export interface Response {
  status(code: number): Response;
  json(data: unknown): void;
  send(body: string): void;
  locals?: Record<string, unknown>;
}

export type Middleware = (req: Request, res: Response, next: () => void) => void;

// FIX: Middlewares now use the base Request/Response which include the augmented fields
export function authMiddleware(
  req: Request,
  _res: Response,
  next: () => void
): void {
  req.user = { id: "user-1", name: "Alice", role: "admin" };
  next();
}

export function requestIdMiddleware(
  req: Request,
  _res: Response,
  next: () => void
): void {
  req.requestId = `req-${Date.now()}`;
  next();
}

export function protectedHandler(
  req: Request,
  res: Response
): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json({
    message: `Hello ${req.user.name}`,
    requestId: req.requestId,
  });
}

// FIX: No `as any` needed — Request now has `user` property
export function getUserRole(req: Request): string {
  return req.user?.role ?? "anonymous";
}

// FIX: All middleware signatures are now compatible with the Middleware type
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
