# Hint 1 -- Mild

For an object to work with `for...of`, it must implement the **iterable protocol**. What method does JavaScript look for on an object when you write `for (const x of obj)`? Is the method name a string or a Symbol?

Also look at what the `next()` method returns. JavaScript expects a specific shape for each result -- what two properties should every result object have?
