# CSS Specificity Wars: When Styles Won't Apply

**ID:** `fe-016-css-specificity`  
**Difficulty:** ★★☆☆☆  
**Estimated Time:** 15 minutes  
**Tags:** `css`, `specificity`, `css-modules`, `styling`  
**Prerequisites:** None

---

## The Scenario

You're building a status badge component that shows different colors for different statuses (success = green, warning = amber, error = red, default = gray). The designer is frustrated because the status-specific colors never appear — every badge shows up gray. The component renders the correct CSS classes, but the styles don't take effect.

## The Bug

The component applies a hardcoded inline `style` for the background color on every badge. Inline styles have higher specificity than class-based styles, so the status-specific classes (applied via className) can never override the default gray background. The component also has a className construction issue where the status class is being set incorrectly.

## Your Task

1. Fix the `StatusBadge` component so that each status type renders with its correct color
2. Remove the inline style override and ensure classes are applied correctly
3. Ensure all tests pass
4. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/StatusBadge.tsx` | Badge component with specificity and className bugs |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [CSS Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) — How the browser decides which styles win
- [Inline Styles vs Classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity#inline_styles) — Why inline styles override almost everything
