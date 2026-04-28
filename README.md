# Bug-Driven Development JS

A hands-on exercise platform for mastering TypeScript, React, Next.js, and Node.js concepts through fixing real-world bugs and code smells. Built for mid-to-senior+ interview preparation.

## Quick Start

```bash
npm install
npm run exercise:list              # Browse all 130 exercises
npm run exercise -- fe-001         # Start an exercise (supports fuzzy match)
npm run test:exercise              # Run tests against your code
npm run exercise:hint              # Get a progressive hint
npm run exercise:reset             # Reset to the original buggy code
npm run exercise:check             # Check your solution
```

## How It Works

1. **Pick an exercise** from the catalog (`npm run exercise:list`)
2. **Start it** — the buggy code gets copied to `/sandbox`
3. **Read the README** to understand the scenario and the bug
4. **Fix the code** in `/sandbox/src/`
5. **Run tests** — they fail on buggy code, pass when you fix it
6. **Check the solution** if you get stuck — each exercise includes an explanation

## Exercise Categories

| Category | Prefix | Count | Topics |
|----------|--------|-------|--------|
| Frontend | `fe-` | 25 | React hooks, re-renders, performance, Redux, a11y, concurrent features |
| Backend | `be-` | 23 | Security, middleware, API design, caching, auth, streams, crypto |
| Fullstack | `fs-` | 15 | SSR, hydration, server components, streaming, RSC serialization |
| TypeScript | `ts-` | 12 | Type safety, generics, conditional types, branded types, builders |
| Testing | `test-` | 15 | Unit tests, mocking, async testing, hooks, parameterized, snapshots |
| JavaScript | `js-` | 20 | Array methods, sorting, closures, promises, generators, proxies |
| LeetCode | `lc-` | 20 | Algorithms, data structures, time/space complexity, optimization |

## Difficulty Scale

| Level | Label | Description |
|-------|-------|-------------|
| 1 | Warm-up | Quick fix, single concept |
| 2 | Standard | Clear bug, requires understanding of one concept |
| 3 | Intermediate | Multi-file or interacting concepts |
| 4 | Advanced | Complex, multiple concepts interacting |
| 5 | Challenge | Architectural, requires deep understanding |

## Project Structure

```
exercises/           # Exercise templates (don't edit these)
  frontend/          # fe-001 through fe-025
  backend/           # be-001 through be-023
  fullstack/         # fs-001 through fs-015
  typescript/        # ts-001 through ts-012
  testing/           # test-001 through test-015
  javascript/        # js-001 through js-020
  leetcode/          # lc-001 through lc-020
sandbox/             # Your working directory (exercises copied here)
scripts/             # CLI tooling
shared/test-utils/   # Shared testing infrastructure
docs/                # Exercise catalog and guides
```

## Tech Stack

- Next.js 16 (App Router)
- React 19, TypeScript 5
- Vitest + React Testing Library
- Tailwind CSS 4
