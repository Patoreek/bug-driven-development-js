# Compound Components: Escaping Prop Drilling Hell

**ID:** `fe-020-compound-component`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 35 minutes  
**Tags:** `react`, `compound-components`, `context`, `prop-drilling`, `patterns`  
**Prerequisites:** None

---

## The Scenario

You inherited an Accordion component that works but is a nightmare to maintain and extend. Every piece of state is threaded through 3+ levels of props. The `Accordion` passes `expandedItems` and `toggleItem` to `AccordionItem`, which passes `isExpanded` and `onToggle` to `AccordionHeader`, which passes them to `AccordionContent`. Adding a new feature means modifying every component in the chain.

The tech lead wants you to refactor this to the compound component pattern using React context, so that each sub-component can access the shared state directly without prop drilling.

## The Bug

The component works correctly but suffers from severe prop drilling. The tests expect the compound component API: `<Accordion>`, `<Accordion.Item>`, `<Accordion.Header>`, and `<Accordion.Content>` as composable sub-components that share state via context, not props.

## Your Task

1. Refactor the Accordion to use the compound component pattern with React context
2. Export `Accordion` with `.Item`, `.Header`, and `.Content` as static properties
3. Each sub-component should access shared state from context instead of props
4. Ensure all tests pass
5. Do NOT modify test files

## Files to Modify

| File | Description |
|------|-------------|
| `src/Accordion.tsx` | Tightly-coupled accordion with prop drilling |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Compound Components Pattern](https://www.patterns.dev/react/compound-pattern/) — Building composable component APIs
- [React Context](https://react.dev/reference/react/createContext) — Sharing state without prop drilling
