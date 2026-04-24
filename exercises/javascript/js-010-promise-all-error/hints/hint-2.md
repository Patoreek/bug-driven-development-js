# Hint 2 -- Medium

There's a Promise combinator method that was added to JavaScript specifically to solve this problem. It returns results for **all** promises, regardless of whether they fulfilled or rejected. Each result has a `status` property telling you which outcome occurred.

Look up `Promise.allSettled()`.
