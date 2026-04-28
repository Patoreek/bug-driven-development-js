# Hint 1 -- Mild

Look at the data structure used to store cached entries. What kind of reference does it hold to its keys? If the key object is no longer used anywhere else in your application, can the garbage collector reclaim it?

Also look at the API surface of the cache -- are there methods that only work with certain collection types?
