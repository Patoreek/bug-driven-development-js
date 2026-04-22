# Solution: Accessible Modal

## The Problem

The original modal was a plain `<div>` with no accessibility features:

1. **No ARIA attributes** — Screen readers couldn't identify it as a dialog
2. **No focus trapping** — Keyboard users could Tab to elements behind the modal
3. **No Escape handler** — Common expectation for closing dialogs
4. **No focus management** — Focus stayed on the trigger button instead of moving to the modal

## The Fix

### 1. ARIA Attributes

Added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` to the modal container:

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
>
```

And added an `id` to the title element:

```tsx
<h2 id={titleId}>{title}</h2>
```

### 2. Focus Trapping

Added a `keydown` event listener that intercepts Tab and Shift+Tab:

- On Tab at the last focusable element: prevents default and focuses the first element
- On Shift+Tab at the first focusable element: prevents default and focuses the last element

### 3. Escape Key

Added Escape key detection in the same `keydown` handler to call `onClose()`.

### 4. Auto-focus

When the modal opens, the first focusable element inside the dialog receives focus automatically.

## Key Takeaway

Modals require careful accessibility work. The WAI-ARIA Dialog Pattern specifies these requirements. Native `<dialog>` elements handle some of this automatically, but when building custom modals, you must implement focus trapping, ARIA attributes, and keyboard handling yourself.
