# Hint 1 (Mild)

Look at how the tests find elements. They all use `container.querySelector` with CSS selectors. React Testing Library has built-in queries accessible via `screen` that don't depend on the DOM structure. Check the component's JSX -- it already has labels, roles, and aria attributes you can query against.
