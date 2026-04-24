# Upcoming Exercises

Planned exercises organized by topic. Each section lists exercise ideas with target difficulty and core concept. Exercises move to `docs/EXERCISES.md` once implemented.

---

## Database (`db-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `db-001-missing-index` | Fix the Slow Query | 3 | Indexes, EXPLAIN plans, full table scans |
| `db-002-connection-pool-exhaustion` | Fix the Connection Pool Leak | 4 | Connection pooling, leak detection, releasing connections |
| `db-003-zero-downtime-migration` | Fix the Breaking Migration | 4 | Backward-compatible schema changes, zero-downtime deploys |
| `db-004-soft-delete-cascade` | Fix the Soft Delete Query | 3 | Soft deletes, default scopes, cascading filters |
| `db-005-orm-eager-loading` | Fix the ORM N+1 | 3 | Prisma includes, eager vs lazy loading, query batching |
| `db-006-normalization-tradeoff` | Fix the Denormalized Read | 3 | Normalization vs denormalization, materialized views |
| `db-007-optimistic-locking` | Fix the Concurrent Edit | 4 | Version columns, optimistic locking, conflict resolution |
| `db-008-cursor-pagination` | Fix the Pagination Performance | 4 | Cursor-based vs offset pagination, keyset pagination |

## Real-Time & Communication (`rt-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `rt-001-websocket-reconnect` | Fix the WebSocket Reconnection | 3 | WebSocket lifecycle, reconnect with backoff, heartbeat |
| `rt-002-websocket-message-order` | Fix the Message Ordering | 4 | Message sequence numbers, out-of-order delivery |
| `rt-003-sse-connection-limit` | Fix the SSE Connection Limit | 3 | Server-Sent Events, browser connection limits, HTTP/2 |
| `rt-004-long-polling-timeout` | Fix the Long Polling Timeout | 3 | Long polling, timeout handling, reconnection |
| `rt-005-graphql-n-plus-one` | Fix the GraphQL N+1 | 4 | DataLoader, batching resolvers, query depth limiting |

## Caching (`cache-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `cache-001-redis-cache-aside` | Fix the Cache-Aside Pattern | 3 | Cache-aside, TTL, stale reads |
| `cache-002-write-through` | Fix the Write-Through Cache | 4 | Write-through vs write-behind, consistency |
| `cache-003-browser-cache-headers` | Fix the Cache-Control Headers | 3 | Cache-Control, ETags, stale-while-revalidate |
| `cache-004-service-worker-offline` | Fix the Offline Cache Strategy | 4 | Service workers, cache-first vs network-first |
| `cache-005-memoization-leak` | Fix the Unbounded Memoization | 3 | Memoization, LRU eviction, cache key serialization |

## Performance (`perf-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `perf-001-bundle-treeshake` | Fix the Tree Shaking Failure | 3 | Dead code elimination, side effects, barrel exports |
| `perf-002-core-web-vitals` | Fix the LCP / CLS | 4 | Largest Contentful Paint, Cumulative Layout Shift |
| `perf-003-web-worker-offload` | Offload to a Web Worker | 4 | Web Workers, transferable objects, postMessage |
| `perf-004-memory-leak-detached` | Fix the Detached DOM Memory Leak | 4 | Detached DOM nodes, heap snapshots, WeakRef |
| `perf-005-image-optimization` | Fix the Image Loading | 3 | next/image, lazy loading, responsive srcset, AVIF/WebP |

## Design Patterns (`dp-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `dp-001-circuit-breaker` | Implement the Circuit Breaker | 4 | Circuit breaker states, failure thresholds, half-open |
| `dp-002-retry-backoff` | Fix the Retry Logic | 3 | Exponential backoff, jitter, max retries, idempotency |
| `dp-003-state-machine` | Fix the Boolean State Soup | 4 | Explicit state machines, impossible states, transitions |
| `dp-004-strategy-pattern` | Refactor to Strategy Pattern | 3 | Swappable algorithms, open/closed principle |
| `dp-005-observer-leak` | Fix the Observer Memory Leak | 3 | EventEmitter, unsubscribe on cleanup, WeakRef listeners |

## Auth & Authorization (`auth-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `auth-001-oauth-pkce` | Fix the OAuth PKCE Flow | 4 | Authorization code + PKCE, token exchange, redirect URI |
| `auth-002-rbac-check` | Fix the RBAC Permission Check | 3 | Role-based access, permission inheritance, deny-by-default |
| `auth-003-multi-tenant-leak` | Fix the Multi-Tenant Data Leak | 5 | Row-level security, tenant context propagation |
| `auth-004-api-key-rotation` | Fix the API Key Rotation | 4 | Key rotation, grace periods, hashing vs encrypting keys |

## API Design (`api-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `api-001-cursor-pagination` | Fix the API Pagination | 3 | Cursor vs offset, total count performance trap |
| `api-002-webhook-verification` | Fix the Webhook Handler | 4 | Signature verification, replay protection, idempotency |
| `api-003-file-upload-resumable` | Fix the File Upload | 4 | Chunked uploads, presigned URLs, resumable protocol |
| `api-004-api-versioning` | Fix the API Version Break | 3 | URL vs header versioning, backward compatibility |

## Observability (`obs-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `obs-001-structured-logging` | Fix the Log Format | 3 | Structured JSON logs, correlation IDs, log levels |
| `obs-002-distributed-tracing` | Fix the Trace Propagation | 4 | OpenTelemetry, trace context, span hierarchy |
| `obs-003-health-check` | Fix the Health Check | 3 | Liveness vs readiness, dependency health, graceful degradation |
| `obs-004-error-grouping` | Fix the Error Tracking | 3 | Error fingerprinting, source maps, breadcrumbs |

## Message Queues & Events (`mq-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `mq-001-pubsub-fanout` | Fix the Pub/Sub Fan-Out | 3 | Topic-based routing, subscriber isolation |
| `mq-002-dead-letter-queue` | Fix the Poison Message | 4 | Dead letter queues, retry limits, manual review |
| `mq-003-idempotent-consumer` | Fix the Duplicate Processing | 4 | Idempotency keys, at-least-once delivery, deduplication |
| `mq-004-event-sourcing-rebuild` | Fix the Event Replay | 5 | Event sourcing, snapshots, projection rebuild |
| `mq-005-cqrs-sync` | Fix the Read Model Sync | 4 | CQRS, eventual consistency, read model projections |

## Concurrency & Async (`async-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `async-001-promise-race-timeout` | Fix the Request Timeout | 3 | Promise.race for timeouts, cleanup on cancel |
| `async-002-semaphore` | Fix the Concurrent Request Limit | 4 | Semaphore pattern, limiting parallel operations |
| `async-003-async-iterator-stream` | Fix the Async Iterator | 4 | for await...of, backpressure, async generators |
| `async-004-worker-threads` | Fix the Blocking Computation | 4 | Node worker_threads, message passing, transferable |
| `async-005-debounce-edge-cases` | Fix the Debounce Edge Cases | 3 | Leading vs trailing, cancel, flush, this binding |

## Data Handling (`data-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `data-001-zod-transforms` | Fix the Validation Pipeline | 3 | Zod transforms, parsing vs validation, coercion |
| `data-002-json-serialization` | Fix the JSON Round-Trip | 3 | Date, BigInt, undefined, Map/Set in JSON, superjson |
| `data-003-csv-streaming` | Fix the CSV Parser | 4 | Streaming large files, encoding, malformed rows |
| `data-004-dynamic-query-builder` | Fix the Dynamic Query | 4 | Composable filters, SQL injection in dynamic WHERE |

## Architecture (`arch-`)

| ID | Title | Diff | Concept |
|----|-------|------|---------|
| `arch-001-feature-flag-cleanup` | Fix the Stale Feature Flag | 3 | Feature flags, dead code, runtime toggles |
| `arch-002-config-validation` | Fix the Config at Startup | 3 | Zod config schema, fail-fast, env validation |
| `arch-003-dependency-inversion` | Fix the Tight Coupling | 4 | Clean architecture, ports and adapters, DI |
| `arch-004-error-boundary-architecture` | Fix the Graceful Degradation | 4 | Fallback UIs, partial failure, feature isolation |

---

## Priority Order

**Batch 1** — High interview frequency:
1. Database (db-001 through db-008)
2. Real-Time (rt-001 through rt-005)
3. Caching (cache-001 through cache-005)

**Batch 2** — Senior+ differentiators:
4. Performance (perf-001 through perf-005)
5. Design Patterns (dp-001 through dp-005)
6. Auth (auth-001 through auth-004)

**Batch 3** — System design depth:
7. API Design (api-001 through api-004)
8. Observability (obs-001 through obs-004)
9. Message Queues (mq-001 through mq-005)

**Batch 4** — Advanced:
10. Concurrency (async-001 through async-005)
11. Data Handling (data-001 through data-004)
12. Architecture (arch-001 through arch-004)

---

**Total planned: 72 new exercises** across 12 new categories.
Combined with existing 110 exercises = **182 exercises** when complete.
