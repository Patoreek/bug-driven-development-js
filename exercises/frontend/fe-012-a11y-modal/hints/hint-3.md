Here's the focus trap logic:

1. Query all focusable elements inside the modal (buttons, inputs, links, etc.)
2. On Tab at the last element: `e.preventDefault()` and focus the first element
3. On Shift+Tab at the first element: `e.preventDefault()` and focus the last element
4. On Escape: call `onClose()`
5. When the modal opens, focus the first focusable element inside it

Use a `ref` on the dialog container and `querySelectorAll` to find focusable elements.
