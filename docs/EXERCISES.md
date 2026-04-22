# Exercise Catalog

## Frontend (20 exercises)

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `fe-001-stale-closure-counter` | Fix the Stale Closure in Counter | ★★☆☆☆ | 15m | Stale closures, functional useState updates |
| `fe-002-unnecessary-rerenders` | Stop the Unnecessary Re-renders | ★★☆☆☆ | 20m | React.memo, useCallback, referential equality |
| `fe-003-expensive-computation` | Optimize the Expensive List Filter | ★★☆☆☆ | 15m | useMemo for derived data |
| `fe-004-useeffect-infinite-loop` | Break the Infinite useEffect Loop | ★☆☆☆☆ | 10m | useEffect dependency array |
| `fe-005-ref-vs-state` | Timer That Loses Its Reference | ★★★☆☆ | 20m | useRef vs useState for mutable values |
| `fe-006-context-performance` | Context Provider Re-render Storm | ★★★☆☆ | 25m | Context splitting, value memoization |
| `fe-007-conditional-hook` | Fix the Conditional Hook Call | ★★☆☆☆ | 10m | Rules of hooks |
| `fe-008-error-boundary` | Catch the Uncaught Render Error | ★★☆☆☆ | 15m | Error boundaries, componentDidCatch |
| `fe-009-data-fetching-waterfall` | Eliminate the Data Fetching Waterfall | ★★★☆☆ | 25m | Parallel data fetching, Promise.all |
| `fe-010-uncontrolled-form` | Tame the Uncontrolled Form | ★★☆☆☆ | 15m | Controlled vs uncontrolled inputs |
| `fe-011-key-prop-list` | Fix the Disappearing List Items | ★★☆☆☆ | 15m | Key prop, reconciliation |
| `fe-012-a11y-modal` | Make the Modal Accessible | ★★★☆☆ | 25m | Focus trap, aria, keyboard navigation |
| `fe-013-lazy-loading-flash` | Fix the Flash of Loading Content | ★★★☆☆ | 20m | React.lazy, Suspense, code splitting |
| `fe-014-event-listener-leak` | Stop the Memory Leak in Event Listeners | ★★★☆☆ | 15m | useEffect cleanup |
| `fe-015-redux-mutation` | Fix the Redux State Mutation | ★★☆☆☆ | 15m | Immutable state, Redux Toolkit |
| `fe-016-css-specificity` | Win the CSS Specificity Battle | ★★☆☆☆ | 15m | CSS specificity, CSS modules |
| `fe-017-race-condition-fetch` | Fix the Search Race Condition | ★★★★☆ | 30m | AbortController, async race conditions |
| `fe-018-derived-state-antipattern` | Remove the Derived State Anti-pattern | ★★★☆☆ | 20m | Single source of truth |
| `fe-019-portal-event-bubbling` | Fix the Portal Event Propagation | ★★★☆☆ | 20m | React Portals, event bubbling |
| `fe-020-compound-component` | Refactor to Compound Components | ★★★★☆ | 35m | Compound component pattern, context |

## Backend (18 exercises)

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `be-001-unvalidated-api-input` | Validate the Dangerous API Input | ★★☆☆☆ | 15m | Zod validation, input sanitization |
| `be-002-sql-injection` | Close the SQL Injection Hole | ★★☆☆☆ | 15m | Parameterized queries |
| `be-003-missing-auth-check` | Add the Missing Authorization | ★★☆☆☆ | 15m | Middleware auth, RBAC |
| `be-004-n-plus-one-query` | Fix the N+1 Database Query | ★★★☆☆ | 25m | Query optimization, eager loading |
| `be-005-error-swallowing` | Stop Swallowing Errors | ★★☆☆☆ | 15m | Error propagation, error types |
| `be-006-rate-limit-bypass` | Fix the Rate Limiter Bypass | ★★★☆☆ | 20m | Rate limiting, IP spoofing |
| `be-007-jwt-vulnerabilities` | Secure the JWT Implementation | ★★★★☆ | 30m | JWT algorithm, expiry, refresh |
| `be-008-env-var-exposure` | Stop Leaking Environment Variables | ★★☆☆☆ | 15m | NEXT_PUBLIC prefix, server-only |
| `be-009-middleware-order` | Fix the Middleware Execution Order | ★★★☆☆ | 20m | Next.js middleware, matcher |
| `be-010-api-error-responses` | Standardize API Error Responses | ★★☆☆☆ | 15m | Error format, HTTP status codes |
| `be-011-cors-misconfiguration` | Fix the CORS Configuration | ★★★☆☆ | 20m | CORS headers, preflight |
| `be-012-cache-stampede` | Prevent the Cache Stampede | ★★★★☆ | 30m | Cache invalidation, stale-while-revalidate |
| `be-013-xss-in-api-response` | Sanitize the API Response | ★★★☆☆ | 20m | XSS prevention, output encoding |
| `be-014-session-fixation` | Fix the Session Security | ★★★★☆ | 30m | Session fixation, secure cookies |
| `be-015-logging-sensitive-data` | Stop Logging Passwords | ★★☆☆☆ | 15m | Log sanitization, PII |
| `be-016-rest-api-design` | Fix the RESTful API Design | ★★☆☆☆ | 15m | REST conventions, HTTP methods |
| `be-017-graceful-shutdown` | Handle Server Shutdown Gracefully | ★★★☆☆ | 25m | Signal handling, connection draining |
| `be-018-transaction-rollback` | Fix the Partial Database Write | ★★★★☆ | 30m | Transactions, rollback |

## Fullstack (10 exercises)

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `fs-001-hydration-mismatch` | Fix the Hydration Mismatch | ★★★☆☆ | 20m | SSR vs client rendering |
| `fs-002-server-client-boundary` | Fix the Server/Client Component Boundary | ★★★☆☆ | 20m | "use client" directive |
| `fs-003-server-action-validation` | Secure the Server Action | ★★★☆☆ | 20m | Server action validation |
| `fs-004-streaming-ssr` | Optimize with Streaming SSR | ★★★★☆ | 30m | Suspense on server, streaming |
| `fs-005-revalidation-stale-data` | Fix the Stale Data After Mutation | ★★★☆☆ | 20m | revalidatePath, revalidateTag |
| `fs-006-optimistic-update-rollback` | Fix the Optimistic Update Rollback | ★★★★☆ | 30m | useOptimistic, error recovery |
| `fs-007-parallel-routes` | Fix the Parallel Route Layout | ★★★☆☆ | 20m | Parallel routes, default.tsx |
| `fs-008-api-overfetching` | Stop Overfetching in the API Layer | ★★★☆☆ | 20m | Field selection, DTOs |
| `fs-009-swr-cache-sync` | Fix the SWR Cache Inconsistency | ★★★★☆ | 25m | SWR mutate, cache keys |
| `fs-010-e2e-test-flakiness` | Fix the Flaky End-to-End Test | ★★★★☆ | 25m | Test determinism, wait strategies |

## TypeScript (7 exercises)

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `ts-001-unsafe-any-cast` | Remove the Unsafe `any` Casts | ★★☆☆☆ | 15m | unknown vs any, proper typing |
| `ts-002-discriminated-union` | Fix the Type Narrowing | ★★★☆☆ | 20m | Discriminated unions, exhaustive checks |
| `ts-003-generic-constraints` | Constrain the Generic Function | ★★★☆☆ | 20m | Generic constraints |
| `ts-004-type-predicate` | Write the Type Guard | ★★★☆☆ | 20m | Type predicates |
| `ts-005-mapped-types` | Fix the API Response Types | ★★★★☆ | 25m | Mapped types, template literals |
| `ts-006-module-augmentation` | Extend the Third-Party Types | ★★★★☆ | 25m | Declaration merging |
| `ts-007-type-variance` | Fix the Type Variance Bug | ★★★★★ | 30m | Covariance, contravariance |

## Testing (10 exercises)

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `test-001-missing-assertions` | Add the Missing Assertions | ★★☆☆☆ | 15m | Test quality, meaningful assertions |
| `test-002-mock-leak` | Fix the Leaking Mock | ★★☆☆☆ | 15m | Mock cleanup, test isolation |
| `test-003-async-test` | Fix the Async Test | ★★★☆☆ | 20m | Async/await in tests, act() |
| `test-004-fragile-selectors` | Fix the Fragile Test Selectors | ★★☆☆☆ | 15m | RTL queries, accessible selectors |
| `test-005-mock-implementation` | Fix the Over-Mocked Test | ★★★☆☆ | 20m | Mock boundaries, testing behavior |
| `test-006-snapshot-abuse` | Fix the Snapshot Test | ★★★☆☆ | 20m | Snapshot testing pitfalls |
| `test-007-shared-state` | Fix the Test Order Dependency | ★★★☆☆ | 20m | Shared state, test isolation |
| `test-008-timer-test` | Fix the Timer Test | ★★★☆☆ | 20m | Fake timers, vi.useFakeTimers |
| `test-009-error-path-test` | Test the Error Paths | ★★★★☆ | 25m | Error boundary testing, rejection testing |
| `test-010-integration-boundary` | Fix the Integration Test Boundary | ★★★★☆ | 30m | Integration vs unit, proper test scope |
