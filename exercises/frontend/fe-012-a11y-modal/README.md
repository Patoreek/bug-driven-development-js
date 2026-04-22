# Accessible Modal: More Than Just a Div

**ID:** `fe-012-a11y-modal`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 25 minutes  
**Tags:** `react`, `accessibility`, `aria`, `focus-management`  
**Prerequisites:** None

---

## The Scenario

Your team shipped a confirmation modal for deleting user accounts. It looks fine visually, but the accessibility audit came back red. Screen reader users can't tell it's a dialog, keyboard users can tab behind the modal to interact with the page, and pressing Escape does nothing. The PM says you can't ship until these a11y issues are resolved.

## The Bug

The modal component is essentially a styled `<div>` with no accessibility considerations:
- No `role="dialog"` or `aria-modal` attributes
- No focus trapping (Tab key moves focus to elements behind the overlay)
- No Escape key handler to close the modal
- Focus doesn't move to the modal when it opens

## Your Task

1. Add proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
2. Trap focus inside the modal when it's open
3. Handle the Escape key to close the modal
4. Move focus into the modal when it opens
5. Ensure all tests pass
6. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Modal.tsx` | Modal component missing accessibility features |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Accessible dialog best practices
- [Focus Management in React](https://react.dev/reference/react/useRef) — Using refs for focus control
