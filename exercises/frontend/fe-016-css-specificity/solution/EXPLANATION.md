# Solution: CSS Specificity Wars

## The Problem

There were two bugs in the StatusBadge component:

### Bug 1: Hardcoded class lookup
```tsx
// Always uses "default" regardless of the status prop
const statusClass = statusClasses["default"];
```

This should have used the `status` prop as the lookup key.

### Bug 2: Hardcoded inline style
```tsx
style={{ backgroundColor: "#6b7280", ... }}
```

The background color was hardcoded to gray instead of using the dynamic `statusColors[status]` value. Since inline styles have higher specificity than any class-based rule, even if the correct class was applied, the gray would always win.

## The Fix

1. Use the `status` prop for the class lookup:
```tsx
const statusClass = statusClasses[status];
```

2. Use the dynamic color for the inline style:
```tsx
style={{ backgroundColor: statusColors[status], ... }}
```

## Key Takeaway

Inline styles (`style={}`) override class-based styles because they have the highest specificity (short of `!important`). When you mix inline styles with class-based styling, make sure the inline styles are also dynamic — or better yet, move all styling to classes. In this case, keeping inline styles with dynamic values is acceptable since the colors map directly to the status.
