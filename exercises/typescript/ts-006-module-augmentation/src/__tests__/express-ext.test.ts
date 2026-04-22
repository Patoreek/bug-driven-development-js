import { describe, it, expect, vi } from "vitest";
import {
  authMiddleware,
  requestIdMiddleware,
  protectedHandler,
  getUserRole,
  createPipeline,
  type Request,
  type Response,
} from "../express-ext";

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    url: "/test",
    method: "GET",
    headers: {},
    ...overrides,
  };
}

function createMockResponse(): Response & { _status: number; _body: unknown } {
  const res: any = {
    _status: 200,
    _body: null,
    status(code: number) {
      res._status = code;
      return res;
    },
    json(data: unknown) {
      res._body = data;
    },
    send(body: string) {
      res._body = body;
    },
  };
  return res;
}

describe("authMiddleware", () => {
  it("attaches user to the request", () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user!.id).toBe("user-1");
    expect(req.user!.name).toBe("Alice");
    expect(req.user!.role).toBe("admin");
    expect(next).toHaveBeenCalled();
  });
});

describe("requestIdMiddleware", () => {
  it("attaches a request ID", () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn();

    requestIdMiddleware(req, res, next);

    expect(req.requestId).toBeDefined();
    expect(req.requestId).toMatch(/^req-\d+$/);
    expect(next).toHaveBeenCalled();
  });
});

describe("protectedHandler", () => {
  it("returns 401 when user is not set", () => {
    const req = createMockRequest();
    const res = createMockResponse();

    protectedHandler(req, res);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ error: "Unauthorized" });
  });

  it("returns greeting when user is set via middleware", () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn();

    authMiddleware(req, res, next);
    requestIdMiddleware(req, res, next);

    protectedHandler(req, res);

    expect(res._body).toEqual({
      message: "Hello Alice",
      requestId: req.requestId,
    });
  });

  it("returns greeting when user is set directly on request (no middleware)", () => {
    // This tests that protectedHandler reads from req.user directly,
    // not from headers or any other workaround.
    const req = createMockRequest();
    (req as any).user = { id: "u-2", name: "Bob", role: "user" };
    (req as any).requestId = "req-test-123";
    const res = createMockResponse();

    protectedHandler(req, res);

    expect(res._status).toBe(200);
    expect(res._body).toEqual({
      message: "Hello Bob",
      requestId: "req-test-123",
    });
  });
});

describe("getUserRole", () => {
  it("returns the user role when authenticated", () => {
    const req = createMockRequest();
    const next = vi.fn();
    const res = createMockResponse();

    authMiddleware(req, res, next);

    const role = getUserRole(req);
    expect(role).toBe("admin");
  });

  it("returns anonymous when not authenticated", () => {
    const req = createMockRequest();
    const role = getUserRole(req);
    expect(role).toBe("anonymous");
  });
});

describe("createPipeline", () => {
  it("runs middlewares in order then calls handler", () => {
    const order: string[] = [];

    const mw1 = vi.fn((req: Request, _res: Response, next: () => void) => {
      order.push("mw1");
      next();
    });

    const mw2 = vi.fn((req: Request, _res: Response, next: () => void) => {
      order.push("mw2");
      next();
    });

    const handler = vi.fn((req: Request, _res: Response, _next: () => void) => {
      order.push("handler");
    });

    const pipeline = createPipeline([mw1, mw2], handler);
    const req = createMockRequest();
    const res = createMockResponse();

    pipeline(req, res, vi.fn());

    expect(order).toEqual(["mw1", "mw2", "handler"]);
  });

  it("auth + requestId middlewares work in pipeline", () => {
    const pipeline = createPipeline(
      [authMiddleware, requestIdMiddleware],
      protectedHandler as any
    );

    const req = createMockRequest();
    const res = createMockResponse();

    pipeline(req, res, vi.fn());

    expect(res._body).toHaveProperty("message", "Hello Alice");
    expect(res._body).toHaveProperty("requestId");
  });
});
