export type RequestHandler = (
  req: { id: string; path: string }
) => Promise<{ status: number; body: string }>;

export type CleanupFn = () => Promise<void>;

export interface ServerState {
  isShuttingDown: boolean;
  activeRequests: number;
  cleanupFns: CleanupFn[];
  signalHandlers: Map<string, () => void>;
}

/**
 * Creates a server instance with request handling and lifecycle management.
 */
export function createServer() {
  const state: ServerState = {
    isShuttingDown: false,
    activeRequests: 0,
    cleanupFns: [],
    signalHandlers: new Map(),
  };

  // Resolvers for the drain promise — called when activeRequests hits 0
  let drainResolve: (() => void) | null = null;

  /**
   * Registers a cleanup function to run on shutdown.
   */
  function onCleanup(fn: CleanupFn): void {
    state.cleanupFns.push(fn);
  }

  /**
   * Handles an incoming request.
   * Rejects new requests during shutdown with 503.
   */
  async function handleRequest(
    handler: RequestHandler,
    req: { id: string; path: string }
  ): Promise<{ status: number; body: string }> {
    if (state.isShuttingDown) {
      return { status: 503, body: "Service is shutting down" };
    }

    state.activeRequests++;
    try {
      return await handler(req);
    } finally {
      state.activeRequests--;
      if (state.activeRequests === 0 && drainResolve) {
        drainResolve();
      }
    }
  }

  /**
   * Initiates graceful shutdown:
   * 1. Stop accepting new requests
   * 2. Wait for in-flight requests to finish
   * 3. Run cleanup functions
   */
  async function shutdown(): Promise<void> {
    if (state.isShuttingDown) {
      return;
    }

    state.isShuttingDown = true;

    // Wait for active requests to drain
    if (state.activeRequests > 0) {
      await new Promise<void>((resolve) => {
        drainResolve = resolve;
      });
    }

    // Run cleanup functions in order
    for (const fn of state.cleanupFns) {
      await fn();
    }
  }

  /**
   * Registers signal handlers for graceful shutdown.
   */
  function registerSignalHandlers(
    onSignal: (signal: string, handler: () => void) => void
  ): void {
    const handler = () => {
      shutdown();
    };
    onSignal("SIGTERM", handler);
    onSignal("SIGINT", handler);
  }

  return {
    state,
    onCleanup,
    handleRequest,
    shutdown,
    registerSignalHandlers,
  };
}
