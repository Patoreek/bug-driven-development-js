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
 *
 * BUG: No graceful shutdown implementation — missing signal handlers,
 * no connection draining, no cleanup execution.
 */
export function createServer() {
  const state: ServerState = {
    isShuttingDown: false,
    activeRequests: 0,
    cleanupFns: [],
    signalHandlers: new Map(),
  };

  /**
   * Registers a cleanup function to run on shutdown.
   */
  function onCleanup(fn: CleanupFn): void {
    state.cleanupFns.push(fn);
  }

  /**
   * Handles an incoming request.
   * Should reject new requests during shutdown.
   */
  async function handleRequest(
    handler: RequestHandler,
    req: { id: string; path: string }
  ): Promise<{ status: number; body: string }> {
    // BUG: Doesn't check if server is shutting down
    // BUG: Doesn't track active requests
    const response = await handler(req);
    return response;
  }

  /**
   * Initiates graceful shutdown:
   * 1. Stop accepting new requests
   * 2. Wait for in-flight requests to finish (with timeout)
   * 3. Run cleanup functions
   *
   * BUG: Not implemented at all!
   */
  async function shutdown(): Promise<void> {
    // BUG: Does nothing — no state change, no waiting, no cleanup
  }

  /**
   * Registers signal handlers for graceful shutdown.
   *
   * BUG: Not implemented — no signal handlers registered!
   */
  function registerSignalHandlers(
    onSignal: (signal: string, handler: () => void) => void
  ): void {
    // BUG: No signal handlers registered
    // Should register handlers for SIGTERM and SIGINT
  }

  return {
    state,
    onCleanup,
    handleRequest,
    shutdown,
    registerSignalHandlers,
  };
}
