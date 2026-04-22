Add `onClick={(e) => e.stopPropagation()}` on the portal's root `<ul>` element:

```tsx
createPortal(
  <ul
    role="listbox"
    data-testid="dropdown-menu"
    onClick={(e) => e.stopPropagation()}
  >
    {/* ... */}
  </ul>,
  portalContainer
)
```

This prevents click events from bubbling beyond the dropdown menu in the React tree, so the toolbar's `onClick` won't fire.
