# Hint 1 (Mild)

Every time the parent component re-renders (e.g., when typing in the search box), all child components also re-render. React provides a way to skip re-rendering a component when its props haven't changed. Look into `React.memo`.
