import { describe, it, expect } from "vitest";
import {
  buildPipeline,
  getDefaultPipeline,
  type Request,
  type Response,
} from "../middleware";

function createRequest(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    ...overrides,
  };
}

function createResponse(): Response {
  return {
    status: 200,
    body: null,
    headers: {},
  };
}

describe("Middleware Pipeline", () => {
  describe("ordering", () => {
    it("should set requestId before logging runs", () => {
      const pipeline = buildPipeline(getDefaultPipeline());
      const req = createRequest({
        headers: { authorization: "Bearer admin-token" },
      });
      const res = createResponse();

      pipeline(req, res);

      // requestId should be set
      expect(req.requestId).toBeDefined();
      expect(req.requestId).toMatch(/^req_/);
      // logging should have recorded it
      expect(req.logged).toBe(true);
    });

    it("should parse body before auth middleware runs", () => {
      const pipeline = buildPipeline(getDefaultPipeline());
      const req = createRequest({
        headers: { authorization: "Bearer admin-token" },
        rawBody: '{"action": "test"}',
      });
      const res = createResponse();

      pipeline(req, res);

      // Body should be parsed
      expect(req.body).toEqual({ action: "test" });
    });

    it("should run auth before adminOnly", () => {
      const pipeline = buildPipeline(getDefaultPipeline());
      const req = createRequest({
        headers: { authorization: "Bearer user-token" },
      });
      const res = createResponse();

      pipeline(req, res);

      // Auth should have run and set user
      expect(req.user).toBeDefined();
      // AdminOnly should return 403 (not 500)
      expect(res.status).toBe(403);
    });
  });

  describe("correct pipeline order", () => {
    it("should have requestId as first middleware", () => {
      const pipeline = getDefaultPipeline();
      // The first middleware should be requestId
      const req = createRequest({});
      const res = createResponse();
      const next = () => {};

      pipeline[0](req, res, next);
      expect(req.requestId).toBeDefined();
    });

    it("should have logging as second middleware", () => {
      const pipeline = getDefaultPipeline();
      const req = createRequest({ requestId: "req_test" });
      const res = createResponse();
      const next = () => {};

      pipeline[1](req, res, next);
      expect(req.logged).toBe(true);
    });

    it("should have bodyParser as third middleware", () => {
      const pipeline = getDefaultPipeline();
      const req = createRequest({ rawBody: '{"test": true}' });
      const res = createResponse();
      const next = () => {};

      pipeline[2](req, res, next);
      expect(req.body).toEqual({ test: true });
    });

    it("should have auth as fourth middleware", () => {
      const pipeline = getDefaultPipeline();
      const req = createRequest({
        headers: { authorization: "Bearer admin-token" },
      });
      const res = createResponse();
      const next = () => {};

      pipeline[3](req, res, next);
      expect(req.user).toBeDefined();
    });

    it("should have adminOnly as fifth middleware", () => {
      const pipeline = getDefaultPipeline();
      expect(pipeline).toHaveLength(5);
    });
  });

  describe("full pipeline - admin", () => {
    it("should allow admin requests through the full pipeline", () => {
      const pipeline = buildPipeline(getDefaultPipeline());
      const req = createRequest({
        headers: { authorization: "Bearer admin-token" },
        rawBody: '{"data": "test"}',
      });
      const res = createResponse();

      pipeline(req, res);

      expect(res.status).toBe(200);
      expect(req.requestId).toBeDefined();
      expect(req.logged).toBe(true);
      expect(req.body).toEqual({ data: "test" });
      expect(req.user?.role).toBe("admin");
    });
  });

  describe("full pipeline - unauthenticated", () => {
    it("should reject unauthenticated requests with 401", () => {
      const pipeline = buildPipeline(getDefaultPipeline());
      const req = createRequest({});
      const res = createResponse();

      pipeline(req, res);

      expect(res.status).toBe(401);
    });
  });
});
