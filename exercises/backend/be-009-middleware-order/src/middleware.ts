// BUG: The middleware pipeline has ordering issues that cause
// security and functional problems.

export interface Request {
  headers: Record<string, string | undefined>;
  body?: unknown;
  rawBody?: string;
  user?: { id: string; role: string };
  requestId?: string;
  logged?: boolean;
}

export interface Response {
  status: number;
  body: unknown;
  headers: Record<string, string>;
}

export type NextFn = () => void;
export type Middleware = (req: Request, res: Response, next: NextFn) => void;

/**
 * Assigns a unique request ID to the request.
 */
export const requestIdMiddleware: Middleware = (req, _res, next) => {
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  next();
};

/**
 * Logs the request (requires requestId to be set).
 */
export const loggingMiddleware: Middleware = (req, _res, next) => {
  // Depends on requestId being set first
  if (req.requestId) {
    req.logged = true;
  }
  next();
};

/**
 * Parses JSON body from rawBody.
 */
export const bodyParserMiddleware: Middleware = (req, _res, next) => {
  if (req.rawBody) {
    try {
      req.body = JSON.parse(req.rawBody);
    } catch {
      req.body = undefined;
    }
  }
  next();
};

/**
 * Authenticates the user from the Authorization header.
 */
export const authMiddleware: Middleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status = 401;
    res.body = { error: "Authentication required" };
    return; // Don't call next — request is rejected
  }

  // Simple token-to-user mapping
  const users: Record<string, { id: string; role: string }> = {
    "Bearer admin-token": { id: "user-1", role: "admin" },
    "Bearer user-token": { id: "user-2", role: "user" },
  };

  const user = users[authHeader];
  if (!user) {
    res.status = 401;
    res.body = { error: "Invalid token" };
    return;
  }

  req.user = user;
  next();
};

/**
 * Checks if the user has admin role.
 * Depends on authMiddleware having run first.
 */
export const adminOnlyMiddleware: Middleware = (req, res, next) => {
  // BUG: If auth hasn't run yet, req.user is undefined — this crashes or bypasses
  if (!req.user) {
    res.status = 500;
    res.body = { error: "Internal error: auth not initialized" };
    return;
  }

  if (req.user.role !== "admin") {
    res.status = 403;
    res.body = { error: "Admin access required" };
    return;
  }

  next();
};

/**
 * Builds a middleware pipeline and runs it.
 *
 * BUG: The middleware is in the wrong order!
 * Current (broken):  logging -> auth -> bodyParser -> requestId -> adminOnly
 * The issues:
 *  - logging runs before requestId, so requestId is not available yet
 *  - bodyParser runs after auth, so auth can't read parsed body if needed
 *  - requestId runs too late in the pipeline
 */
export function buildPipeline(middlewares: Middleware[]): (req: Request, res: Response) => void {
  return (req: Request, res: Response) => {
    let index = 0;
    const next = () => {
      if (index < middlewares.length) {
        const mw = middlewares[index++];
        mw(req, res, next);
      }
    };
    next();
  };
}

/**
 * Returns the default middleware stack.
 *
 * BUG: Wrong ordering causes multiple failures.
 */
export function getDefaultPipeline(): Middleware[] {
  // BUG: This ordering is wrong!
  return [
    loggingMiddleware,      // runs before requestId is set
    authMiddleware,
    bodyParserMiddleware,   // runs after auth — body not available during auth
    requestIdMiddleware,    // runs too late — logging already happened
    adminOnlyMiddleware,
  ];
}
