# Solution: Portal Event Bubbling

## The Problem

React portals have a surprising behavior: even though the portal renders its children into a different DOM node (outside the parent's DOM subtree), **events bubble through the React component tree, not the DOM tree**.

So when the `Dropdown` is a child of `Toolbar` in the React tree:

```
<Toolbar onClick={onToolbarClick}>
  <Dropdown>  ←─── React parent
    {portal → <ul>...</ul>}  ←─── Events bubble UP the React tree
  </Dropdown>
</Toolbar>
```

A click on a dropdown option bubbles through:
1. `<li>` (option) → `<ul>` (menu) → through the React portal boundary → `<Dropdown>` → `<Toolbar>` → fires `onToolbarClick`

Even though in the DOM, the `<ul>` is in `document.body`, not inside the toolbar `<div>`.

## The Fix

Add `onClick={(e) => e.stopPropagation()}` on the portal's root element:

```tsx
createPortal(
  <ul
    role="listbox"
    data-testid="dropdown-menu"
    onClick={(e) => e.stopPropagation()}
  >
    {/* options */}
  </ul>,
  portalContainer
)
```

This stops the click event from propagating up the React tree beyond the dropdown menu.

## Key Takeaway

React portals maintain the React event bubbling hierarchy regardless of where the DOM nodes actually live. This is by design — it lets portals participate naturally in the React component tree. But it means you need `stopPropagation()` when you don't want portal events to reach ancestors in the React tree.
