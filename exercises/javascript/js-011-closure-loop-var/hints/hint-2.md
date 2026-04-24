# Hint 2 -- Medium

`var` is function-scoped, meaning there's only **one** variable `i` for the entire function. All closures created in the loop reference that same single variable. By the time any closure runs, `i` has already reached its final value.

There's a keyword introduced in ES6 that creates a new binding for each iteration of the loop.
