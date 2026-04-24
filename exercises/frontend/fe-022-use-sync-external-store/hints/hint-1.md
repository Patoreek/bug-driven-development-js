# Hint 1 (Mild)

The `useEffect + useState` pattern subscribes to the store *after* render. React 18+ has a dedicated hook for subscribing to external data sources that reads the value *during* render, preventing tearing. Look at what React provides specifically for this use case.
