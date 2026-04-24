# Hint 2 (Medium)

You need **two** pieces of state: one for the input value (urgent, always current) and one for the query that drives the expensive filter (deferred via `startTransition`). The input's `value` prop should be bound to the urgent state, while `useMemo` should depend on the deferred state.
