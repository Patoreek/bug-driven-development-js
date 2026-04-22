# Solution: Compound Components

## The Problem

The original accordion threaded all state through props at every level:

```
Accordion (has state)
  → AccordionItem (receives expandedItems, toggleItem as props)
    → AccordionHeader (receives isExpanded, onToggle as props)
    → AccordionContent (receives isExpanded as prop)
```

Every component needed to know about and forward props it didn't directly use. Adding a new feature meant modifying every component in the chain.

The buggy version had sub-components attached as static properties but they required props (like `isExpanded` and `onToggle`) that the parent never provided via context, so they couldn't function when composed as children.

## The Fix

Use **two React contexts** to share state without prop drilling:

### 1. AccordionContext
Provides `expandedItems` (Set) and `toggleItem` function from the root `<Accordion>`.

### 2. ItemContext  
Provided by each `<Accordion.Item>`, it exposes the item's `itemId` and computed `isExpanded` boolean to its children.

### How each sub-component gets what it needs:

- **`Accordion`** — Creates and provides `AccordionContext` with state and toggle function
- **`Accordion.Item`** — Reads `expandedItems` from `AccordionContext`, creates `ItemContext` with `itemId` and `isExpanded`
- **`Accordion.Header`** — Reads `toggleItem` from `AccordionContext` and `itemId`/`isExpanded` from `ItemContext`
- **`Accordion.Content`** — Reads `isExpanded` from `ItemContext`

No component passes props to its children. Each sub-component self-serves from context.

## Key Takeaway

The compound component pattern combines `createContext` with static component properties to create a declarative, composable API:

```tsx
<Accordion allowMultiple>
  <Accordion.Item itemId="1">
    <Accordion.Header>Title</Accordion.Header>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

This is the same pattern used by libraries like Radix UI, Headless UI, and Reach UI. It eliminates prop drilling and gives consumers full control over markup and composition.
