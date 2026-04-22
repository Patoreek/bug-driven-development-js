# Fix the Fragile Test Selectors

**ID:** `test-004-fragile-selectors`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `testing`, `vitest`, `react-testing-library`, `accessible-queries`  
**Prerequisites:** None

---

## The Scenario

Your team's CI pipeline has been breaking every sprint -- not because of bugs, but because someone renamed a CSS class or slightly restructured the JSX. The tests for the `TodoList` component use `container.querySelector` and DOM tag selectors everywhere. A recent accessibility audit added proper labels and ARIA attributes to the component, but the tests still poke at raw DOM structure instead of leveraging those accessible hooks. Your tech lead wants the tests rewritten to use React Testing Library's recommended query hierarchy so they stop breaking on cosmetic changes.

## The Problem

Every test reaches into `container` with `querySelector`, `querySelectorAll`, and CSS selectors like `"input[type='text']"` or `"li button"`. These queries are tightly coupled to the DOM structure and break whenever the markup is rearranged, even when the user-facing behavior hasn't changed. React Testing Library provides a clear query priority (`getByRole` > `getByLabelText` > `getByText` > ...) that makes tests resilient and accessible-aware.

## Your Task

1. Fix the test file at `src/__tests__/TodoList.test.tsx`
2. Do NOT modify the application code in `src/`
3. Replace all `container.querySelector`/`querySelectorAll` calls with appropriate RTL queries (`screen.getByRole`, `screen.getByLabelText`, `screen.getByText`, etc.)
4. All tests should pass AND meaningfully verify behavior

## Files to Modify

| File | Description |
|------|-------------|
| `src/__tests__/TodoList.test.tsx` | The flawed test file using fragile DOM selectors |

## Files to Read (don't modify)

| File | Description |
|------|-------------|
| `src/TodoList.tsx` | The correct TodoList component with accessible markup |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [RTL Query Priority](https://testing-library.com/docs/queries/about#priority) -- which queries to prefer
- [RTL ByRole](https://testing-library.com/docs/queries/byrole) -- the most resilient query type
- [RTL ByLabelText](https://testing-library.com/docs/queries/bylabeltext) -- for form inputs
- [Accessible Names](https://www.w3.org/TR/accname-1.1/) -- how aria-label and label elements work
