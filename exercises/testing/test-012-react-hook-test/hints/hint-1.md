# Hint 1 -- Mild

You don't need to render a React component to test a hook. React Testing Library provides a dedicated utility for this. Look at what `@testing-library/react` exports besides `render` and `screen`.

Think about what the hook returns: a tuple of `[value, setValue, removeValue]`. You should be able to inspect and call these directly.
