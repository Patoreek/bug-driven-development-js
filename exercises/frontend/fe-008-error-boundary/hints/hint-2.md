# Hint 2 (Medium)

React provides "error boundaries" — class components that implement `static getDerivedStateFromError()` and/or `componentDidCatch()`. These catch errors thrown by their child components during rendering and let you display a fallback UI. Error boundaries must be class components; there is no hook equivalent.
