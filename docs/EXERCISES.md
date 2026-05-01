# Exercise Catalog

## Frontend (25 exercises)

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
| `fe-021-concurrent-features` | Fix the Concurrent Features Misuse | ★★★★☆ | 30m | startTransition, concurrent rendering |
| `fe-022-use-sync-external-store` | Fix the External Store Tearing | ★★★★☆ | 30m | useSyncExternalStore, concurrent tearing |
| `fe-023-render-prop-closure` | Fix the Render Prop Closure | ★★★★☆ | 25m | Render props, memoization, stale closures |
| `fe-024-virtualized-list-leak` | Fix the Virtualized List Leak | ★★★★★ | 35m | Virtualization, memory leaks, passive listeners |
| `fe-025-suspense-error-reset` | Fix the Suspense Error Reset | ★★★★★ | 35m | Error boundaries, Suspense, retry patterns |

## Backend (23 exercises)

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
| `be-019-timing-attack` | Fix the Timing Attack | ★★★★☆ | 25m | Constant-time comparison, crypto |
| `be-020-prototype-pollution` | Fix the Prototype Pollution | ★★★★★ | 30m | Prototype chain, deep merge safety |
| `be-021-race-condition-db` | Fix the Database Race Condition | ★★★★☆ | 30m | Optimistic locking, double-spending |
| `be-022-stream-backpressure` | Fix the Stream Backpressure | ★★★★★ | 35m | Streams, backpressure, OOM prevention |
| `be-023-regex-dos` | Fix the Regex DoS | ★★★★☆ | 25m | ReDoS, catastrophic backtracking |

## Fullstack (15 exercises)

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
| `fs-011-middleware-chain-auth` | Fix the Middleware Auth Chain | ★★★★☆ | 30m | Token refresh, middleware matchers |
| `fs-012-server-component-data-leak` | Fix the Server Component Data Leak | ★★★★★ | 35m | Per-user caching, cache tags |
| `fs-013-form-double-submit` | Fix the Form Double Submit | ★★★★☆ | 25m | useFormStatus, idempotency |
| `fs-014-rsc-serialization` | Fix the RSC Serialization | ★★★★★ | 35m | Server/client serialization boundary |
| `fs-015-infinite-scroll-memory` | Fix the Infinite Scroll Memory | ★★★★☆ | 30m | Data windowing, memory management |

## TypeScript (12 exercises)

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `ts-001-unsafe-any-cast` | Remove the Unsafe `any` Casts | ★★☆☆☆ | 15m | unknown vs any, proper typing |
| `ts-002-discriminated-union` | Fix the Type Narrowing | ★★★☆☆ | 20m | Discriminated unions, exhaustive checks |
| `ts-003-generic-constraints` | Constrain the Generic Function | ★★★☆☆ | 20m | Generic constraints |
| `ts-004-type-predicate` | Write the Type Guard | ★★★☆☆ | 20m | Type predicates |
| `ts-005-mapped-types` | Fix the API Response Types | ★★★★☆ | 25m | Mapped types, template literals |
| `ts-006-module-augmentation` | Extend the Third-Party Types | ★★★★☆ | 25m | Declaration merging |
| `ts-007-type-variance` | Fix the Type Variance Bug | ★★★★★ | 30m | Covariance, contravariance |
| `ts-008-conditional-types` | Fix the Conditional Type Distribution | ★★★★☆ | 25m | Distributive conditional types |
| `ts-009-template-literal-types` | Fix the Route Type Safety | ★★★★☆ | 25m | Template literal types, route params |
| `ts-010-infer-keyword` | Fix the Recursive Type Unwrap | ★★★★★ | 30m | infer, recursive conditional types |
| `ts-011-branded-types` | Add the Branded Types | ★★★★☆ | 25m | Branded types, nominal typing |
| `ts-012-builder-pattern-types` | Fix the Builder Pattern Types | ★★★★★ | 30m | Generic accumulator, type-safe builders |

## Testing (15 exercises)

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
| `test-011-dependency-injection-test` | Fix the Dependency Injection Test | ★★★★☆ | 25m | DI, mock injection, test isolation |
| `test-012-react-hook-test` | Fix the React Hook Test | ★★★★☆ | 25m | renderHook, testing hooks directly |
| `test-013-parameterized-test` | Fix the Parameterized Tests | ★★★★☆ | 20m | it.each, data-driven tests |
| `test-014-concurrent-test` | Fix the Concurrent Test | ★★★★★ | 30m | Fake timers, async determinism |
| `test-015-snapshot-regression` | Fix the Snapshot Regression | ★★★★★ | 30m | Snapshot corruption, behavioral assertions |

## JavaScript (20 exercises)

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `js-001-filter-boolean-trap` | Fix the Filter Boolean Trap | ★★☆☆☆ | 10m | Array.filter, falsy values, Boolean coercion |
| `js-002-sort-numeric` | Fix the Numeric Sort | ★☆☆☆☆ | 10m | Array.sort, lexicographic vs numeric |
| `js-003-reduce-initial-value` | Fix the Missing Reduce Accumulator | ★★☆☆☆ | 10m | Array.reduce, initial value |
| `js-004-map-parseint` | Fix the Map + parseInt Bug | ★★☆☆☆ | 10m | Array.map, parseInt radix parameter |
| `js-005-sort-stability` | Fix the Unstable Sort | ★★★☆☆ | 15m | Sort stability, multi-key sorting |
| `js-006-flat-map-transform` | Flatten and Transform Correctly | ★★☆☆☆ | 15m | flatMap, nested data |
| `js-007-find-vs-filter` | Use the Right Array Method | ★★☆☆☆ | 10m | find vs filter, early termination |
| `js-008-sort-mutation` | Fix the Accidental Sort Mutation | ★★☆☆☆ | 10m | Sort mutates in-place, toSorted |
| `js-009-reduce-group-by` | Fix the groupBy Reduce | ★★★☆☆ | 15m | reduce for grouping, Object.groupBy |
| `js-010-promise-all-error` | Fix the Promise.all Error Handling | ★★★☆☆ | 15m | Promise.all vs allSettled, error propagation |
| `js-011-closure-loop-var` | Fix the Closure in a Loop | ★★☆☆☆ | 10m | Closures, let vs var, IIFE |
| `js-012-deep-clone-pitfall` | Fix the Shallow Copy Bug | ★★★☆☆ | 15m | Spread operator, structuredClone, deep copy |
| `js-013-debounce-implementation` | Fix the Debounce Function | ★★★☆☆ | 20m | Closures, setTimeout, debounce pattern |
| `js-014-event-loop-order` | Fix the Execution Order | ★★★★☆ | 20m | Event loop, microtasks, macrotasks |
| `js-015-proxy-validation` | Fix the Proxy Validator | ★★★★☆ | 25m | Proxy, Reflect, property traps |
| `js-016-weakmap-memory` | Fix the WeakMap Memory Leak | ★★★★☆ | 25m | WeakMap, garbage collection, caching |
| `js-017-iterator-protocol` | Fix the Iterator Protocol | ★★★★☆ | 25m | Symbol.iterator, iteration protocol |
| `js-018-generator-pagination` | Fix the Generator Pagination | ★★★★☆ | 25m | Async generators, lazy evaluation |
| `js-019-structured-clone-limitations` | Fix the structuredClone Limits | ★★★★☆ | 20m | structuredClone, non-cloneable types |
| `js-020-abortcontroller-cleanup` | Fix the AbortController Cleanup | ★★★★★ | 30m | AbortController, signal, async cancellation |

## LeetCode — Algorithms & Data Structures (20 exercises)

Each exercise provides a brute-force or incorrect solution. Your task: optimize it to the expected time/space complexity.

### Arrays & Hash Maps

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `lc-001-two-sum` | Two Sum | ★★☆☆☆ | 15m | Hash map lookup, O(n) vs O(n²) |
| `lc-002-valid-anagram` | Valid Anagram | ★★☆☆☆ | 10m | Character frequency map |
| `lc-003-merge-intervals` | Merge Intervals | ★★★☆☆ | 20m | Sorting, interval merging |
| `lc-004-group-anagrams` | Group Anagrams | ★★★☆☆ | 20m | Hash map keying strategy |
| `lc-005-product-except-self` | Product of Array Except Self | ★★★☆☆ | 25m | Prefix/suffix products, no division |

### Strings & Sliding Window

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `lc-006-valid-parentheses` | Valid Parentheses | ★★☆☆☆ | 15m | Stack-based matching |
| `lc-007-longest-substring` | Longest Substring Without Repeating | ★★★☆☆ | 25m | Sliding window, Set/Map |
| `lc-008-min-window-substring` | Minimum Window Substring | ★★★★☆ | 30m | Sliding window, two pointers |

### Linked Lists

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `lc-009-reverse-linked-list` | Reverse a Linked List | ★★☆☆☆ | 15m | Pointer manipulation, iterative vs recursive |
| `lc-010-detect-cycle` | Detect Cycle in Linked List | ★★★☆☆ | 20m | Floyd's tortoise and hare |
| `lc-011-merge-sorted-lists` | Merge Two Sorted Lists | ★★☆☆☆ | 15m | Pointer merging, dummy head |

### Trees & Graphs

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `lc-012-max-depth-binary-tree` | Maximum Depth of Binary Tree | ★★☆☆☆ | 10m | DFS recursion, base cases |
| `lc-013-level-order-traversal` | Binary Tree Level Order Traversal | ★★★☆☆ | 20m | BFS, queue-based traversal |
| `lc-014-validate-bst` | Validate Binary Search Tree | ★★★☆☆ | 25m | In-order traversal, range checking |
| `lc-015-number-of-islands` | Number of Islands | ★★★☆☆ | 25m | DFS/BFS flood fill, grid traversal |

### Dynamic Programming

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `lc-016-climbing-stairs` | Climbing Stairs | ★★☆☆☆ | 15m | Memoization, bottom-up DP |
| `lc-017-coin-change` | Coin Change | ★★★☆☆ | 25m | DP, BFS, optimal substructure |
| `lc-018-longest-common-subseq` | Longest Common Subsequence | ★★★★☆ | 30m | 2D DP table, string comparison |

### Advanced

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `lc-019-lru-cache` | LRU Cache | ★★★★☆ | 35m | Hash map + doubly linked list, O(1) ops |
| `lc-020-top-k-frequent` | Top K Frequent Elements | ★★★☆☆ | 25m | Bucket sort, heap, frequency map |

## Microsoft Interview — LeetCode (12 exercises)

Each exercise provides a brute-force or incorrect solution to a Microsoft interview favorite. Your task: optimize or fix it.

### Strings & Arrays

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `ms-001-valid-palindrome` | Valid Palindrome | ★☆☆☆☆ | 10m | Two pointers, alphanumeric filtering |
| `ms-002-simplify-path` | Simplify Path | ★★☆☆☆ | 15m | Stack, string parsing |
| `ms-003-reverse-words-string` | Reverse Words in a String II | ★★☆☆☆ | 15m | In-place reversal, two-pass technique |

### Linked Lists

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `ms-004-merge-k-sorted-lists` | Merge k Sorted Lists | ★★★☆☆ | 25m | Divide and conquer, O(N log k) |

### Trees & BST

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `ms-005-closest-bst-value` | Closest Binary Search Tree Value | ★★☆☆☆ | 15m | BST binary search, O(h) traversal |
| `ms-006-inorder-successor-bst` | Inorder Successor in BST | ★★★☆☆ | 20m | BST property, successor tracking |
| `ms-007-largest-bst-subtree` | Largest BST Subtree | ★★★☆☆ | 25m | Post-order traversal, bottom-up validation |

### Design

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `ms-008-design-tic-tac-toe` | Design Tic-Tac-Toe | ★★☆☆☆ | 20m | O(1) move checking, row/col/diag sums |
| `ms-011-design-excel-sum-formula` | Design Excel Sum Formula | ★★★★★ | 40m | Formula storage, reactive re-evaluation |
| `ms-012-design-search-autocomplete` | Design Search Autocomplete System | ★★★★☆ | 35m | Trie, prefix search, frequency ranking |

### Math & Dynamic Programming

| ID | Title | Difficulty | Time | Concepts |
|----|-------|-----------|------|----------|
| `ms-009-water-jug-problem` | Water and Jug Problem | ★★★☆☆ | 20m | GCD, Bézout's identity |
| `ms-010-four-keys-keyboard` | 4 Keys Keyboard | ★★★☆☆ | 25m | DP, multi-paste recurrence |
