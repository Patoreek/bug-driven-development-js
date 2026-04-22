# Getting Started

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
git clone <repo-url>
cd bug-driven-development-js
npm install
```

## Workflow

### 1. Browse exercises

```bash
npm run exercise:list
```

This shows all 55 exercises grouped by category (Frontend, Backend, Fullstack, TypeScript) with difficulty ratings and estimated times.

### 2. Start an exercise

```bash
npm run exercise -- fe-001-stale-closure-counter
# Or use partial match:
npm run exercise -- stale-closure
```

This copies the exercise files into the `sandbox/` directory and displays the exercise README.

### 3. Read the instructions

Open `sandbox/README.md` to understand:
- The scenario (realistic workplace context)
- What's wrong (the bug description)
- What you need to fix (specific tasks)

### 4. Fix the code

Edit files in `sandbox/src/`. The buggy code has a conceptual flaw — not a typo, but a misunderstanding of how something works.

### 5. Run tests

```bash
npm run test:exercise
```

Tests are designed to **fail** on the buggy code and **pass** when you fix it correctly.

### 6. Get hints (if stuck)

```bash
npm run exercise:hint    # Run up to 3 times for progressively stronger hints
```

Hints go from a mild nudge to nearly giving away the answer.

### 7. Check your solution

```bash
npm run exercise:check
```

If all tests pass, you'll get a congratulations message and a pointer to the detailed explanation.

### 8. Read the explanation

Each exercise has a `solution/EXPLANATION.md` in the original exercise directory that explains:
- **Why** the bug happens (the underlying concept)
- The fix with before/after comparison
- How this comes up in interviews
- Common variations of the bug

### 9. Reset or move on

```bash
npm run exercise:reset   # Start over with the original buggy code
npm run exercise -- <next-exercise-id>  # Move to next exercise
```

## Recommended Path

### Beginner → Mid Level
Start with difficulty 1-2 exercises:
1. `fe-004` (useEffect infinite loop)
2. `fe-001` (stale closure)
3. `fe-010` (controlled vs uncontrolled)
4. `be-001` (input validation)
5. `ts-001` (unsafe any)

### Mid → Senior Level
Move to difficulty 3 exercises:
1. `fe-006` (context performance)
2. `fe-017` (race conditions)
3. `be-004` (N+1 queries)
4. `fs-001` (hydration mismatch)
5. `ts-002` (discriminated unions)

### Senior+ Challenge
Tackle difficulty 4-5:
1. `be-007` (JWT security)
2. `be-012` (cache stampede)
3. `fs-006` (optimistic update rollback)
4. `ts-007` (type variance)
5. `fe-020` (compound components)

## Project Structure

```
exercises/           # Exercise templates (read-only)
  frontend/          # fe-001 through fe-020
  backend/           # be-001 through be-018
  fullstack/         # fs-001 through fs-010
  typescript/        # ts-001 through ts-007
sandbox/             # Your working directory
scripts/             # CLI tools
shared/test-utils/   # Test setup
docs/                # This file and exercise catalog
```
