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

export const requestIdMiddleware: Middleware = (req, _res, next) => {
  req.requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  next();
};

export const loggingMiddleware: Middleware = (req, _res, next) => {
  if (req.requestId) {
    req.logged = true;
  }
  next();
};

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

export const authMiddleware: Middleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status = 401;
    res.body = { error: "Authentication required" };
    return;
  }

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

export const adminOnlyMiddleware: Middleware = (req, res, next) => {
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
 * Returns the correctly ordered middleware stack:
 * 1. requestId — assign tracking ID first
 * 2. logging — log the request (needs requestId)
 * 3. bodyParser — parse the body (before auth in case auth needs it)
 * 4. auth — authenticate the user
 * 5. adminOnly — check authorization (needs auth to have run)
 */
export function getDefaultPipeline(): Middleware[] {
  return [
    requestIdMiddleware,
    loggingMiddleware,
    bodyParserMiddleware,
    authMiddleware,
    adminOnlyMiddleware,
  ];
}
