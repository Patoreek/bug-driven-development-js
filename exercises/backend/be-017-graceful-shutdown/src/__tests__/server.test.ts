import { createServer } from "../server";

describe("Graceful Shutdown", () => {
  describe("normal request handling", () => {
    it("handles requests successfully when not shutting down", async () => {
      const server = createServer();
      const handler = async () => ({ status: 200, body: "OK" });

      const result = await server.handleRequest(handler, {
        id: "1",
        path: "/api/test",
      });
      expect(result.status).toBe(200);
      expect(result.body).toBe("OK");
    });

    it("tracks active request count", async () => {
      const server = createServer();
      let resolveHandler!: () => void;
      const handler = async () => {
        await new Promise<void>((r) => {
          resolveHandler = r;
        });
        return { status: 200, body: "OK" };
      };

      const requestPromise = server.handleRequest(handler, {
        id: "1",
        path: "/test",
      });

      // While request is in-flight, active count should be 1
      expect(server.state.activeRequests).toBe(1);

      resolveHandler();
      await requestPromise;

      // After request completes, active count should be 0
      expect(server.state.activeRequests).toBe(0);
    });
  });

  describe("shutdown behavior", () => {
    it("sets isShuttingDown flag", async () => {
      const server = createServer();
      expect(server.state.isShuttingDown).toBe(false);
      await server.shutdown();
      expect(server.state.isShuttingDown).toBe(true);
    });

    it("rejects new requests during shutdown with 503", async () => {
      const server = createServer();
      const handler = async () => ({ status: 200, body: "OK" });

      await server.shutdown();

      const result = await server.handleRequest(handler, {
        id: "2",
        path: "/api/test",
      });
      expect(result.status).toBe(503);
      expect(result.body).toContain("shutting down");
    });

    it("waits for in-flight requests to complete before resolving", async () => {
      const server = createServer();
      let resolveHandler!: () => void;
      const handler = async () => {
        await new Promise<void>((r) => {
          resolveHandler = r;
        });
        return { status: 200, body: "OK" };
      };

      // Start a request
      const requestPromise = server.handleRequest(handler, {
        id: "1",
        path: "/test",
      });

      // Start shutdown while request is in-flight
      let shutdownResolved = false;
      const shutdownPromise = server.shutdown().then(() => {
        shutdownResolved = true;
      });

      // Shutdown should not resolve yet (request still active)
      await new Promise((r) => setTimeout(r, 50));
      expect(shutdownResolved).toBe(false);

      // Complete the in-flight request
      resolveHandler();
      await requestPromise;

      // Now shutdown should resolve
      await shutdownPromise;
      expect(shutdownResolved).toBe(true);
    });

    it("runs cleanup functions during shutdown", async () => {
      const server = createServer();
      const cleanupOrder: string[] = [];

      server.onCleanup(async () => {
        cleanupOrder.push("db-disconnect");
      });
      server.onCleanup(async () => {
        cleanupOrder.push("cache-flush");
      });

      await server.shutdown();

      expect(cleanupOrder).toEqual(["db-disconnect", "cache-flush"]);
    });

    it("runs cleanup after all requests complete", async () => {
      const server = createServer();
      const events: string[] = [];

      let resolveHandler!: () => void;
      const handler = async () => {
        await new Promise<void>((r) => {
          resolveHandler = r;
        });
        events.push("request-complete");
        return { status: 200, body: "OK" };
      };

      server.onCleanup(async () => {
        events.push("cleanup");
      });

      // Start request
      const requestPromise = server.handleRequest(handler, {
        id: "1",
        path: "/test",
      });

      // Start shutdown
      const shutdownPromise = server.shutdown();

      // Complete request
      resolveHandler();
      await requestPromise;
      await shutdownPromise;

      // Cleanup should happen after request
      expect(events).toEqual(["request-complete", "cleanup"]);
    });

    it("is idempotent - calling shutdown twice doesn't double-run cleanup", async () => {
      const server = createServer();
      let cleanupCount = 0;

      server.onCleanup(async () => {
        cleanupCount++;
      });

      await server.shutdown();
      await server.shutdown();

      expect(cleanupCount).toBe(1);
    });
  });

  describe("signal handler registration", () => {
    it("registers handlers for SIGTERM and SIGINT", () => {
      const server = createServer();
      const registeredSignals: string[] = [];

      server.registerSignalHandlers((signal, handler) => {
        registeredSignals.push(signal);
        server.state.signalHandlers.set(signal, handler);
      });

      expect(registeredSignals).toContain("SIGTERM");
      expect(registeredSignals).toContain("SIGINT");
    });

    it("signal handler triggers shutdown", async () => {
      const server = createServer();

      server.registerSignalHandlers((signal, handler) => {
        server.state.signalHandlers.set(signal, handler);
      });

      // Simulate SIGTERM
      const sigtermHandler = server.state.signalHandlers.get("SIGTERM");
      expect(sigtermHandler).toBeDefined();
      sigtermHandler!();

      // Give async shutdown time to start
      await new Promise((r) => setTimeout(r, 10));
      expect(server.state.isShuttingDown).toBe(true);
    });
  });
});
