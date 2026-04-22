Two changes needed:

1. Change `statusClasses["default"]` to `statusClasses[status]`
2. Change the hardcoded `backgroundColor: "#6b7280"` in the `style` prop to `backgroundColor: statusColors[status]`

This way both the class name and the inline color reflect the actual status.
