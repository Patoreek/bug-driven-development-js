# Hint 2

For multi-key sorting, use a single comparator that checks keys in order of priority. If the primary key comparison returns `0` (equal), fall through to the secondary key. The `||` operator is useful here because `0 || secondaryResult` returns `secondaryResult`.

For `sortTasks`, you need to add a date comparison when priorities are equal.
