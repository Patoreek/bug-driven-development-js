# CLAUDE.md — Bug-Driven Development JS

## Overview

Exercise platform where users fix buggy/suboptimal TypeScript + Next.js code. 110 exercises across frontend, backend, fullstack, typescript, testing, and javascript categories.

## Commands

```bash
npm install                        # Install dependencies
npm run dev                        # Next.js dev server (port 3000)
npm run exercise:list              # List all exercises
npm run exercise -- <id>           # Copy exercise to sandbox
npm run test:exercise              # Run tests against sandbox
npm run exercise:check             # Check solution
npm run exercise:reset             # Reset sandbox
npm run exercise:hint              # Show next hint
npm run test:verify                # Run tests against exercise templates
```

## Project Structure

- `exercises/{frontend,backend,fullstack,typescript}/` — exercise templates
- `sandbox/` — user's working directory (exercises copied here)
- `scripts/` — CLI tooling (tsx)
- `shared/test-utils/` — shared Vitest/RTL setup
- `docs/` — exercise catalog and guides

## Exercise Naming

Format: `{category}-{NNN}-{slug}` (e.g., `fe-001-stale-closure-counter`)
- `fe-` frontend, `be-` backend, `fs-` fullstack, `ts-` typescript, `test-` testing, `js-` javascript

## Generating New Exercises

When asked to create a new exercise, follow this exact process:

### 1. Pick the next available ID

Check `exercises/{category}/` for existing IDs. Use the next number: `{category}-{NNN}-{slug}`. Slug should be kebab-case, descriptive of the core bug/concept.

### 2. Create the directory structure

```
exercises/{category}/{id}/
├── README.md
├── exercise.json
├── src/
│   ├── [buggy implementation files]
│   └── __tests__/
│       └── [test files]
├── solution/
│   ├── [fixed implementation files]
│   └── EXPLANATION.md
└── hints/
    ├── hint-1.md
    ├── hint-2.md
    └── hint-3.md
```

### 3. Write the buggy code FIRST, then the solution

The bug must be:
- **Realistic** — something that actually happens in production
- **Non-obvious** — not a typo, a conceptual misunderstanding
- **Testable** — tests must fail on buggy code, pass on solution

### 4. Write tests that

- FAIL on the buggy `src/` code
- PASS on the `solution/` code
- Test the specific behavior that the bug breaks
- Do NOT test implementation details — test outcomes
- Use Vitest + React Testing Library (for FE) or plain Vitest (for BE/TS)

### 5. exercise.json — all fields required

```json
{
  "id": "{category}-{NNN}-{slug}",
  "title": "Human-readable Title",
  "category": "frontend|backend|fullstack|typescript",
  "difficulty": 1,
  "tags": ["relevant", "tags"],
  "concepts": ["concept1", "concept2"],
  "estimatedMinutes": 15,
  "prerequisites": [],
  "testCommand": "vitest run",
  "files": {
    "buggy": ["src/File.tsx"],
    "testFiles": ["src/__tests__/File.test.tsx"],
    "solutionFiles": ["solution/File.tsx"]
  }
}
```

### 6. README.md template

Must include these sections in order:
- **Title** + metadata table (ID, difficulty stars, time, tags, prerequisites)
- **The Scenario** — realistic workplace context (1-2 paragraphs)
- **The Bug** — what's wrong, without revealing the fix
- **Your Task** — numbered list of what to fix
- **Files to Modify** — table of files and descriptions
- **Running Tests** — the command to run
- **Hints** — 3 `<details>` blocks linking to hint files
- **Concepts to Review** — links to official docs

### 7. Hints must be progressive

- `hint-1.md`: Mild nudge — points to the area of the problem
- `hint-2.md`: Medium — names the specific concept or API involved
- `hint-3.md`: Strong — nearly gives away the answer, just short of the code

### 8. EXPLANATION.md in solution/ must

- Explain WHY the bug happens (the underlying concept)
- Show the fix with a before/after diff
- Link to relevant documentation
- Mention common variations of this bug
- Note interview context — how this concept typically comes up

### 9. After creating the exercise

- Verify tests FAIL on the buggy code: run `npm run test:exercise` after loading it
- Verify tests PASS on solution code (temporarily swap files)
- Update `docs/EXERCISES.md` with the new exercise entry

### Exercise Quality Checklist

- [ ] Bug is realistic and conceptual (not a typo)
- [ ] Tests fail on buggy code, pass on solution
- [ ] README scenario is relatable and workplace-realistic
- [ ] 3 progressive hints from mild to strong
- [ ] EXPLANATION.md teaches the "why", not just the "what"
- [ ] exercise.json has all required fields
- [ ] Difficulty rating is calibrated (1=warmup, 3=standard, 5=challenge)
- [ ] No solution code leaks into the buggy src/ files
