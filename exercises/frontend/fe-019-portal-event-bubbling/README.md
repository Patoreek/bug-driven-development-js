# Portal Surprise: When Clicks Bubble Through the React Tree

**ID:** `fe-019-portal-event-bubbling`  
**Difficulty:** ★★★☆☆  
**Estimated Time:** 25 minutes  
**Tags:** `react`, `portal`, `event-bubbling`, `createPortal`  
**Prerequisites:** None

---

## The Scenario

You're building a toolbar component where each button has a dropdown menu rendered via `createPortal` (to avoid overflow clipping issues). Everything works visually, but there's a nasty bug: clicking a dropdown option triggers the parent toolbar's `onClick` handler, which performs navigation. Users click "Delete" in the dropdown and suddenly find themselves on a different page because the toolbar's click handler also fired.

## The Bug

React portals render children into a different DOM node, but events still bubble through the **React component tree**, not the DOM tree. So a click inside a portal-rendered dropdown bubbles up to the React parent (the toolbar), even though in the DOM, the dropdown is a sibling of the app root. The component doesn't stop this propagation.

## Your Task

1. Fix the event bubbling issue so that clicks inside the portal dropdown don't trigger the parent's `onClick` handler
2. Ensure all tests pass
3. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Dropdown.tsx` | Dropdown with portal event bubbling issue |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Portals](https://react.dev/reference/react-dom/createPortal) — Rendering outside the DOM hierarchy
- [Event Bubbling in Portals](https://react.dev/reference/react-dom/createPortal#caveats) — React tree vs DOM tree
