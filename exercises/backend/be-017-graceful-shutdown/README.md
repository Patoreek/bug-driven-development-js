# Graceful Shutdown

**ID:** `be-017-graceful-shutdown`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 20 minutes  
**Tags:** `server`, `shutdown`, `signals`, `connection-draining`, `reliability`  
**Prerequisites:** None

---

## The Scenario

Your team's API server is deployed in Kubernetes, which sends a SIGTERM signal when it wants to shut down a pod. Currently, the server ignores this signal and gets forcefully killed after the grace period, causing in-flight requests to fail with connection reset errors. Users see intermittent 502 errors during deployments. You need to implement a graceful shutdown handler that finishes in-progress requests before exiting.

## The Bug

The server has no signal handlers for SIGTERM or SIGINT. When a shutdown signal is received:
- Active connections are immediately dropped
- In-flight requests get no response
- Cleanup callbacks (database disconnects, etc.) never run
- The server doesn't stop accepting new connections

## Your Task

1. Examine `src/server.ts` and identify the missing shutdown handling
2. Implement signal handlers that initiate graceful shutdown
3. Stop accepting new requests during shutdown
4. Wait for in-flight requests to complete (with a timeout)
5. Run cleanup callbacks before exit
6. Ensure all tests pass
7. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/server.ts` | Server with missing graceful shutdown |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [SIGTERM and SIGINT](https://man7.org/linux/man-pages/man7/signal.7.html) -- Unix process signals
- [Graceful Shutdown in Node.js](https://nodejs.org/api/net.html#serverclosecallback) -- server.close() documentation
- [Kubernetes Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/) -- how K8s terminates pods
